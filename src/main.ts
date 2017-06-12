import * as stream from 'stream';
import * as through2 from 'through2';
import {
    ClassDefinition,
    ClassMethodDefinition,
    ClassMethodParameterDefinition,
    ClassPropertyDefinition,
    FileDefinition,
    getInfoFromFiles,
    NamedImportPartDefinition
} from 'ts-type-info';
import * as ts from 'typescript';
import * as File from 'vinyl';

export = function structify(): stream.Transform {
    return through2.obj(function (file: File, encoding, callback) {

        let info = getInfoFromFiles([file.path], { includeTsNodes: true });
        let tsFile = info.getFile(f =>  f.fileName.indexOf(file.relative) !== -1);
        
        // If file is valid .ts
        if (tsFile){ 
            let templateImport: NamedImportPartDefinition;
            tsFile.imports.forEach((imprt, index, imports) => {
                switch(imprt.moduleSpecifier){
                    case "gulp-structify/template":
                        templateImport = imprt.namedImports[0];
                        imports.splice(index, 1);
                        break;
                }
            })

            // If file contains Template import
            if (templateImport){
                let searchText = (templateImport.alias || templateImport.name) + "<";
                let templateSubclass = tsFile.getClass(cls => {
                    return cls.extendsTypes.some(extnds => extnds.text.indexOf(searchText) !== -1)
                });

                // If file contains Template subclass
                if(templateSubclass){
                    transformFile(tsFile, templateSubclass);
                    file.contents = new Buffer(tsFile.write());
                }
            }

            callback(null, file);
        }
    });
};

function transformFile(file: FileDefinition, template: ClassDefinition) {
    // destructure src file
    let className = template.name;
    let interfaceName = `${className}Like`;
    let decapClassName = decapitalize(className);
    let properties = normalizeProperties(template.properties);
    let documentation = template.documentationComment;
    let arrayType = template.extendsTypes[0].typeArguments[0].text;

    // Warn that file is autogenerated
    file.onBeforeWrite = writer => writer.write("// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n");

    // Restore function bodies
    file.functions.filter(f => f.tsNode).forEach(func => {
        let node = <ts.FunctionDeclaration><any> func.tsNode;
        func.onWriteFunctionBody = writer => {
            for (let statement of node.body.statements) {
                writer.newLine().write(statement.getText());
            }
        }
    })

     // Add interface with properties copied from template
    file.addInterface({
        name: interfaceName,
        isExported: true,
        documentationComment: documentation,
        properties: properties
    })

    processImports();
    processTemplate();
    processStruct();
    processStructBuffer();

    function processImports(){

        // Remove unnecessary imports
        file.imports.forEach((imprt, index, imports) => {
            switch(imprt.moduleSpecifier){
                case "gulp-structify/like":
                    imports.splice(index, 1);
                    break;
            }
        })

        // Add struct, buf, and mixin imports
        file.addImport({
            moduleSpecifier: 'gulp-structify/struct',
            namedImports: [{name: 'Struct'}] 
        });

        file.addImport({
            moduleSpecifier: 'gulp-structify/buffer',
            namedImports: [{name: 'StructBuffer'}] 
        });

        file.addImport({
            moduleSpecifier: 'gulp-structify/mixin',
            namedImports: [{name: 'applyMixins'}] 
        })

       
    }

    function processTemplate(){
        // Remove template super class
        template.extendsTypes.length = 0;

        // Make sure template is exported
        template.isExported = true;

        // Process template methods
        template.methods.filter(m => m.tsNode).forEach(method => {
            let node = <ts.MethodDeclaration><any> method.tsNode;
            let params = method.parameters;
            // Restore method bodies
            method.onWriteFunctionBody = writer => {
                for (let statement of node.body.statements) {
                    writer.newLine().write(statement.getText());
                }
            }
            // Process @like annotations
            params.forEach(param => {
                param.decorators.forEach((decorator, index, decorators) => {
                    if(decorator.name === "like"){
                        decorators.splice(index, 1); // Remove decorator
                        if(param.type.text === className){
                            param.type.text = interfaceName; // Replace class type with interface type
                        }
                    }
                })
            });
        })

        // Add constructor
        template.setConstructor({
            documentationComment: documentation,
            parameters: properties.map(prop => { return {
                name: prop.name, type: prop.type, defaultExpression: "0"
            }}),
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} = ${prop.name};`);
                }
            }
        })


        // create function parameters
        let other = "other";
        let e = "e";
        let k = "k";

        let p_other = { name: other, type: interfaceName };
        let p_k = { name: k, type: 'number' };
        let p_e = { name: e, type: 'number' };

        // Generate automatic template functions
        template.addMethod({
            name: 'set',
            parameters: [p_other],
            returnType: "void",
            documentationComment: `Sets each component of this ${className} to that of the other ${className}.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} = ${other}.${prop.name};`)
                }
            }
        })

        template.addMethod({
            name: 'set$',
            parameters: properties,
            returnType: "void",
            documentationComment: `Sets each component of this ${className}.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} = ${prop.name};`)
                }
            }
        })

        template.addMethod({
            name: 'setScalar',
            parameters: [p_k],
            returnType: "void",
            documentationComment: `Sets each component of this ${className} to the specified scalar.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} = ${k};`)
                }
            }
        })

        template.addMethod({
            name: 'add',
            parameters: [p_other],
            returnType: "void",
            documentationComment: `Adds the other ${className} to this ${className} componentwise.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} += ${other}.${prop.name};`)
                }
            }
        })

        template.addMethod({
            name: 'add$',
            parameters: properties,
            returnType: "void",
            documentationComment: `Adds the specified values to this ${className} componentwise.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} += ${prop.name};`)
                }
            }
        })

        template.addMethod({
            name: 'subtract',
            parameters: [p_other],
            returnType: "void",
            documentationComment: `Subtracts the other ${className} from this ${className} componentwise.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} -= ${other}.${prop.name};`)
                }
            }
        })

        template.addMethod({
            name: 'subtract$',
            parameters: properties,
            returnType: "void",
            documentationComment: `Subtracts the specified values from this ${className} componentwise.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} -= ${prop.name};`)
                }
            }
        })

        template.addMethod({
            name: 'mulScalar',
            parameters: [p_k],
            returnType: "void",
            documentationComment: `Multiplies each component of this ${className} by the specified scalar.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} *= ${k};`)
                }
            }
        })

        template.addMethod({
            name: 'divScalar',
            parameters: [p_k],
            returnType: "void",
            documentationComment: `Divides each component of this ${className} by the specified scalar.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.${prop.name} /= ${k};`)
                }
            }
        })

        template.addMethod({
            name: 'equals',
            parameters: [p_other],
            returnType: "boolean",
            documentationComment: `Checks if each component of this ${className} is exactly equal to that of the other ${className}.`,
            onWriteFunctionBody: writer => {
                let statements = properties.map((p) => {
                    return `this.${p.name} === ${other}.${p.name}`
                })
                writer.write(`return ${statements.join(" && ")};`);
            }
        })

        template.addMethod({
            name: 'equalsScalar',
            parameters: [p_k],
            returnType: "boolean",
            documentationComment: `Checks if each component of this ${className} is exactly equal to the specified scalar.`,
            onWriteFunctionBody: writer => {
                let statements = properties.map((prop) => {
                    return `this.${prop.name} === ${k}`
                })
                writer.write(`return ${statements.join(" && ")};`);
            }
        })

        template.addMethod({
            name: 'epsilonEquals',
            parameters: [p_other, p_e],
            returnType: "boolean",
            documentationComment: `Checks if each component of this ${className} is approximately equal to that of the other ${className}.`,
            onWriteFunctionBody: writer => {
                let statements = properties.map((prop) => {
                    return `Math.abs(this.${prop.name} - ${other}.${prop.name}) <= ${e}`
                })
                writer.write(`return ${statements.join(" && ")};`);
            }
        })

        template.addMethod({
            name: 'epsilonEqualsScalar',
            parameters: [p_k, p_e],
            returnType: "boolean",
            documentationComment: `Checks if each component of this ${className} is approximately equal to the specified scalar.`,
            onWriteFunctionBody: writer => {
                let statements = properties.map((prop) => {
                    return `Math.abs(this.${prop.name} - ${k}) <= ${e}`
                })
                writer.write(`return ${statements.join(" && ")};`);
            }
        })

        template.addMethod({
            name: 'toString',
            documentationComment: `Returns a string representation of this ${className}.`,
            returnType: "string",
            onWriteFunctionBody: writer => {
                let expressions = properties.map(prop => {
                    return `${prop.name}: \${this.${prop.name}}`
                })
                writer.write(`return \`{ ${expressions.join(", ")} }\``);
            }
        })

        addStaticMethodsToClass(template);
    }

    function processStruct(){
        // Add "Struct" class
        let struct = file.addClass({
            name: `${className}Struct`,
            isExported: true,
            extendsTypes: [`Struct<${arrayType}>`],
            documentationComment: `A ${className} backed by a ${arrayType}.`,
            constructorDef: {
                parameters: [{ name: "data", type: arrayType, defaultExpression: `new ${arrayType}(${properties.length})`}],
                documentationComment: `Creates a ${className} struct backed by the specified data.`,
                onWriteFunctionBody: writer => {
                    writer.newLine().write("super(data);");
                }
            }
        })

        struct.onAfterWrite = writer => {
            writer.newLine().write(`applyMixins(${struct.name}, ${className});`);
        }

        // Add accessors
        properties.forEach((p, i) => {
            struct.addMethod({
                name: "get " + p.name,
                documentationComment: p.documentationComment,
                onWriteFunctionBody: writer => {
                    writer.write(`return this.data[${i}];`);
                }
            })
            struct.addMethod({
                name: "set " + p.name,
                parameters: [{ name: "value", type: "number" }],
                documentationComment: p.documentationComment,
                onWriteFunctionBody: writer => {
                    writer.write(`this.data[${i}] = value;`);
                }
            })
        })

        addStaticMethodsToClass(struct);
        addMethodPropertiesToClass(struct);
    }

    function processStructBuffer(){
        // Add struct buffer class
        let buffer = file.addClass({
            isExported: true,
            name: `${className}Buffer`,
            documentationComment: `A ${className} buffer backed by a ${arrayType}.`,
            extendsTypes: [`StructBuffer<${arrayType}>`],
        });

        buffer.onAfterWrite = writer => {
            writer.newLine().write(`applyMixins(${buffer.name}, ${className});`);
        }

        // Add accessors
        properties.forEach((prop, i) => {
            let comment = prop.documentationComment.replace(`this ${className}`, `the current ${className}`)
            buffer.addMethod({
                name: "get " + prop.name,
                documentationComment: comment,
                onWriteFunctionBody: writer => {
                    writer.write(`return this.data[this.dataPosition + ${i}];`);
                }
            })
            buffer.addMethod({
                name: "set " + prop.name,
                parameters: [{ name: "value", type: "number" }],
                documentationComment: comment,
                onWriteFunctionBody: writer => {
                    writer.write(`this.data[this.dataPosition + ${i}] = value;`);
                }
            })
        })

        // Add methods to class
        let p_position = { name: "position", type: "number" };
        let p_src = { name: "src", type: interfaceName };
        let p_dst = { name: "dst", type: interfaceName, isOptional: true };
        buffer.addMethod({
            name: "structLength",
            documentationComment: `Gets the number of properties in a ${className}, namely ${properties.length}.`,
            onWriteFunctionBody: writer => {
                writer.write(`return ${properties.length};`);
            }
        });
        buffer.addMethod({
            name: "aget",
            parameters: [p_position, p_dst],
            documentationComment: `Gets the components of the ${className} at the specified position of this buffer.`,
            onWriteFunctionBody: writer => {
                writer.newLine().write(`if (${p_dst.name} === void 0){ ${p_dst.name} = new ${className}()};`);
                writer.newLine().write(`let dataPos = position * this.structLength();`)
                for (let prop of properties) {
                    writer.newLine().write(`${p_dst.name}.${prop.name} = this.data[dataPos++];`)
                }
                writer.newLine().write(`return ${p_dst.name};`)
            }
        });
        buffer.addMethod({
            name: "rget",
            parameters: [p_dst],
            documentationComment: `Gets the components of the current ${className}, then moves to the next position of this buffer.`,
            onWriteFunctionBody: writer => {
                writer.newLine().write(`if (${p_dst.name} === void 0){ ${p_dst.name} = new ${className}()};`);
                for (let prop of properties) {
                    writer.newLine().write(`${p_dst.name}.${prop.name} = this.data[this.dataPosition++];`)
                }
                writer.newLine().write(`return ${p_dst.name};`)
            }
        });
        buffer.addMethod({
            name: "aset",
            parameters: [p_position, p_src],
            documentationComment: `Sets each component of the ${className} at the specified position to that of the src ${className}.`,
            onWriteFunctionBody: writer => {
                writer.newLine().write(`let dataPos = position * this.structLength();`)
                for (let prop of properties) {
                    writer.newLine().write(`this.data[dataPos++] = ${p_src.name}.${prop.name};`)
                }
            }
        });
        buffer.addMethod({
            name: "aset$",
            parameters: [p_position, ...properties],
            documentationComment: `Sets each component of the ${className} at the specified position.`,
            onWriteFunctionBody: writer => {
                writer.newLine().write(`let dataPos = position * this.structLength();`)
                for (let prop of properties) {
                    writer.newLine().write(`this.data[dataPos++] = ${prop.name};`)
                }
            }
        });
        buffer.addMethod({
            name: "rset",
            parameters: [p_src],
            documentationComment: `Sets each component of the current ${className} to that of the src ${className}, then moves to the next position of this buffer.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.data[this.dataPosition++] = ${p_src.name}.${prop.name};`)
                }
            }
        });
        buffer.addMethod({
            name: "rset$",
            parameters: properties,
            documentationComment: `Sets each component of the current ${className}, then moves to the next position of this buffer.`,
            onWriteFunctionBody: writer => {
                for (let prop of properties) {
                    writer.newLine().write(`this.data[this.dataPosition++] = ${prop.name};`)
                }
            }
        });
        buffer.addStaticMethod({
            name: `create`,
            parameters: [{ name: "capacity", type: "number" }],
            documentationComment: `Creates an empty ${className} buffer with the specified ${className} capacity.`,
            onWriteFunctionBody: writer => {
                writer.write(`return new ${buffer.name}(new ${arrayType}(capacity * ${properties.length}));`);
            },
        });

        addMethodPropertiesToClass(buffer);
    }

    function addMethodPropertiesToClass(cls: ClassDefinition){
        template.methods.forEach(method => {
            cls.addProperty({
                name: method.name,
                documentationComment: method.documentationComment,
                type: getMethodType(method)
            })
        })
    }

    function addStaticMethodsToClass(cls: ClassDefinition) {
        template.methods
            .filter(method => {
                let name = method.name;
                return name.indexOf("set") === 0 &&         // starts with set
                       name.indexOf(" ") === -1  &&         // not an accessor
                       name !== "setScalar"      &&         // not the setScalar method
                       (name !== "set$" || cls !== template) // not set$ method and template class
            })
            .forEach(setter => {
                let parameters = normalizeMethodParams(setter.parameters);
                let args = parameters.map(p => p.name);
                let name = setter.name.substring("set".length);
                if (name === "" || name === "$") {
                    name = "create" + name;
                }
                cls.addStaticMethod({
                    name: decapitalize(name),
                    parameters: parameters,
                    onWriteFunctionBody: writer => {
                        writer.newLine().write(`let ${decapClassName} = new ${cls.name}();`);
                        writer.newLine().write(`${decapClassName}.${setter.name}(${args.join(", ")});`);
                        writer.newLine().write(`return ${decapClassName};`);
                    }
                })
            })
    }

    return file;
}

interface Property {
    name: string;
    type: string;
    documentationComment: string;
}

function normalizeProperties(properties: ClassPropertyDefinition[]): Property[]{
    return properties.map(p => { return { 
        name: p.name, type: p.type.text, documentationComment: p.documentationComment };
    });
}

// Helper functions: 
function normalizeMethodParams(params: ClassMethodParameterDefinition[]) {
    return params.map(param => { return {
        name: param.name,
        type: param.type.node ? param.type.node.text : param.type.text,
        isOptional: param.isOptional,
        isRestParameter: param.isRestParameter,
        defaultExpression: param.defaultExpression ? param.defaultExpression.text : null,
    }});
}

function getMethodType(method: ClassMethodDefinition){
    let paramsToString = method.parameters.map(param => {
        let name = param.name;
        let type = param.type.text;
        let isOptional = (param.isOptional || param.defaultExpression) ? "?" : "";
        return `${name}${isOptional}: ${type}`;
    }).join(", ");
    return `(${paramsToString}) => ${method.returnType.text}`;
}

function decapitalize(str: String) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

