import * as File from 'vinyl';
import * as stream from 'stream';
import * as ts from "typescript";
import * as tsTypeInfo from "ts-type-info";
import * as through2 from 'through2';

export = function structify(){
    return through2.obj(function (file: File, encoding, callback) {
        let info = tsTypeInfo.getInfoFromFiles([file.path], { includeTsNodes: true });
        let srcFile = info.getFile(f =>
            f.fileName.indexOf(file.relative) !== -1
        )
        if (srcFile) {
            // File must contain Template import and class extending Template
            let templateImport = srcFile.getImport(imprt =>
                imprt.moduleSpecifier.indexOf('gulp-structify/template') !== -1
            )
            let templateSubclass = srcFile.getClass(cls =>
                cls.extendsTypes.some(ext => ext.text.indexOf("Template<") !== -1)
            )
            if (templateImport && templateSubclass) {
                // Remove Template and class import from file
                srcFile.imports = srcFile.imports.filter(imprt => imprt !== templateImport);
                srcFile.classes = srcFile.classes.filter(cls => cls !== templateSubclass);
                // Fill in function bodies
                srcFile.functions.forEach(f => {
                    if (f.tsNode) {
                        let node = <ts.FunctionDeclaration><any>f.tsNode;
                        f.onWriteFunctionBody = writer => {
                            for (let s of node.body.statements) {
                                writer.newLine().write(s.getText());
                            }
                        }
                    }
                })
                // Generate code from template and write to file
                file.contents = new Buffer(generateFileFromTemplate(templateSubclass, srcFile).write());
            }
        }
        callback(null, file);
    });
};

function generateFileFromTemplate(template: tsTypeInfo.ClassDefinition, inFile: tsTypeInfo.FileDefinition) {
    // destructure src file
    let struct = template.name;
    let properties = template.properties;
    let structDoc = template.documentationComment;
    let structLength = properties.length;
    let arrayType = template.extendsTypes[0].typeArguments[0].text;
    let components = properties.map(p => {
        return { name: p.name, type: p.type.text };
    });

    // Create new file
    let outFile = tsTypeInfo.createFile({
        onBeforeWrite:  writer => {
            writer.write("// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n")
        }
    });

    // Move contents of old file to namespace
    outFile.imports = inFile.imports;
    outFile.functions = inFile.functions;
    outFile.classes = inFile.classes;
    outFile.interfaces = inFile.interfaces;
    outFile.typeAliases = inFile.typeAliases;
    outFile.enums = inFile.enums;
    outFile.variables = inFile.variables;
    outFile.namespaces = inFile.namespaces;

    // Add struct and buf imports
    outFile.addImport({
        moduleSpecifier: 'gulp-structify/struct',
        namedImports: [{name: 'Struct'}] 
    });

    outFile.addImport({
        moduleSpecifier: 'gulp-structify/buffer',
        namedImports: [{name: 'StructBuffer'}] 
    });

    // Generate interface with properties copied from the template
    outFile.addInterface({
        name: struct,
        documentationComment: structDoc,
        properties: properties.map(p => {
            return {
                name: p.name,
                type: p.type.text,
                documentationComment: p.documentationComment,
            }
        })
    });

    // Generate namespace with all the template functions
    let nms = outFile.addNamespace({
        name: struct,
        documentationComment: `Namespace for shared ${struct} functions.`,
        onAfterWrite: writer => {
            writer.newLine().write(`export { ${struct} as I${struct} };`)
        }
    });

    // Generate the automatic template functions
    addTemplateFunctionsToNamespace();

    // generate plain old object class
    let objClass = outFile.addClass({
        name: `${struct}Object`,
        documentationComment: structDoc,
        constructorDef: {
            documentationComment: `Creates a ${struct} object with each component initialized to 0.`,
            onWriteFunctionBody: writer => {
                writer.write(`this.setScalar(0);`)
            }
        },
        properties: properties.map(p => {
            return {
                name: p.name,
                type: p.type.text,
                documentationComment: p.documentationComment,
            }
        }),
        onAfterWrite: writer => {
            writer.newLine().write(`export { ${struct}Object as ${struct} };`)
        }
    });
    generateMethodsFromFunctions(objClass, nms.functions);
    generateCreatersFromSetters(objClass);

    // Generate "Struct" class
    let structClass = outFile.addClass({
        name: `${struct}Struct`,
        isExported: true,
        extendsTypes: [`Struct<${arrayType}>`],
        documentationComment: `A ${struct} backed by a ${arrayType}.`,
        constructorDef: {
            documentationComment: `Creates a ${struct} struct.`,
            onWriteFunctionBody: writer => {
                writer.newLine().write(`super(new ${arrayType}(${structLength}));`);
            }
        }
    })
    properties.forEach((p, i) => {
        structClass.addMethod({
            name: "get " + p.name,
            documentationComment: p.documentationComment,
            onWriteFunctionBody: writer => {
                writer.write(`return this.data[${i}];`);
            }
        })
        structClass.addMethod({
            name: "set " + p.name,
            parameters: [{ name: "value", type: "number" }],
            documentationComment: p.documentationComment,
            onWriteFunctionBody: writer => {
                writer.write(`this.data[${i}] = value;`);
            }
        })
    })
    generateMethodsFromFunctions(structClass, nms.functions);
    generateCreatersFromSetters(structClass);

    // Generate struct bfufer class
    let bufClass = outFile.addClass({
        isExported: true,
        name: `${struct}Buffer`,
        documentationComment: `A ${struct} buffer backed by a ${arrayType}.`,
        extendsTypes: [`StructBuffer<${arrayType}>`],
    });
    properties.forEach((p, i) => {
        let comment = p.documentationComment.replace(`this ${struct}`, `the current ${struct}`)
        bufClass.addMethod({
            name: "get " + p.name,
            documentationComment: comment,
            onWriteFunctionBody: writer => {
                writer.write(`return this.data[this.dataPosition + ${i}];`);
            }
        })
        bufClass.addMethod({
            name: "set " + p.name,
            parameters: [{ name: "value", type: "number" }],
            documentationComment: comment,
            onWriteFunctionBody: writer => {
                writer.write(`this.data[this.dataPosition + ${i}] = value;`);
            }
        })
    })
    bufClass.addMethod({
        name: "structLength",
        documentationComment: `Gets the number of components in a ${struct}, namely ${structLength}.`,
        onWriteFunctionBody: writer => {
            writer.write(`return ${structLength};`);
        }
    });
    bufClass.addMethod({
        name: "set$",
        parameters: [{ name: "position", type: "number" }, ...components],
        documentationComment: `Sets each component of the ${struct} at the specified position.`,
        onWriteFunctionBody: writer => {
            writer.newLine().write(`let dataPos = position * this.structLength();`)
            for (let c of components) {
                writer.newLine().write(`this.data[dataPos++] = ${c.name};`)
            }
        }
    });
    bufClass.addMethod({
        name: "put$",
        parameters: components,
        documentationComment: `Sets each component of the current ${struct}, then moves to the next position of this buffer.`,
        onWriteFunctionBody: writer => {
            for (let c of components) {
                writer.newLine().write(`this.data[this.dataPosition++] = ${c.name};`)
            }
        }
    });
    bufClass.addStaticMethod({
        name: `create`,
        parameters: [{ name: "capacity", type: "number" }],
        documentationComment: `Creates an empty ${struct} buffer with the specified ${struct} capacity.`,
        onWriteFunctionBody: writer => {
            writer.write(`return new ${bufClass.name}(new ${arrayType}(capacity * ${structLength}));`);
        },
    });
    nms.functions.forEach((f) => {
        let params = f.parameters.slice(1);
        let comment = f.documentationComment.replace(`this ${struct}`, `the current ${struct}`)
        bufClass.addMethod({
            name: '$' + f.name,
            parameters: params.map((p) => {
                return { name: p.name, type: p.type.text }
            }),
            returnType: f.returnType.text,
            documentationComment: comment,
            onWriteFunctionBody: writer => {
                let functionArgs = ['this', ...params.map(p => p.name)];
                writer.write(`return ${nms.name}.${f.name}(${functionArgs.join(', ')});`);
            }
        })
    })

    function addTemplateFunctionsToNamespace() {

        // create function parameters
        let _this = "_this";
        let other = "other";
        let e = "e";
        let k = "k";

        let p_this = { name: _this, type: struct };
        let p_other = { name: other, type: struct };
        let p_k = { name: k, type: 'number' };
        let p_e = { name: e, type: 'number' };

        // Generate automatic template functions
        nms.addFunction({
            name: 'set',
            isExported: true,
            parameters: [p_this, p_other],
            returnType: "void",
            documentationComment: `Sets each component of this ${struct} to that of the other ${struct}.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} = ${other}.${p.name};`)
                }
            }
        })

        nms.addFunction({
            name: 'set$',
            isExported: true,
            parameters: [p_this, ...components],
            returnType: "void",
            documentationComment: `Sets each component of this ${struct}.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} = ${p.name};`)
                }
            }
        })

        nms.addFunction({
            name: 'setScalar',
            isExported: true,
            parameters: [p_this, p_k],
            returnType: "void",
            documentationComment: `Sets each component of this ${struct} to the specified scalar.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} = ${k};`)
                }
            }
        })

        nms.addFunction({
            name: 'add',
            isExported: true,
            parameters: [p_this, p_other],
            returnType: "void",
            documentationComment: `Adds the other ${struct} to this ${struct} componentwise.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} += ${other}.${p.name};`)
                }
            }
        })

        nms.addFunction({
            name: 'add$',
            isExported: true,
            parameters: [p_this, ...components],
            documentationComment: `Adds the specified values to this ${struct} componentwise.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} += ${p.name};`)
                }
            }
        })

        nms.addFunction({
            name: 'subtract',
            isExported: true,
            parameters: [p_this, p_other],
            returnType: "void",
            documentationComment: `Subtracts the other ${struct} from this ${struct} componentwise.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} -= ${other}.${p.name};`)
                }
            }
        })

        nms.addFunction({
            name: 'subtract$',
            isExported: true,
            parameters: [p_this, ...components],
            documentationComment: `Subtracts the specified values from this ${struct} componentwise.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} -= ${p.name};`)
                }
            }
        })

        nms.addFunction({
            name: 'mulScalar',
            isExported: true,
            parameters: [p_this, p_k],
            returnType: "void",
            documentationComment: `Multiplies each component of this ${struct} by the specified scalar.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} *= ${k};`)
                }
            }
        })

        nms.addFunction({
            name: 'divScalar',
            isExported: true,
            parameters: [p_this, p_k],
            returnType: "void",
            documentationComment: `Divides each component of this ${struct} by the specified scalar.`,
            onWriteFunctionBody: writer => {
                for (let p of properties) {
                    writer.newLine().write(`${_this}.${p.name} /= ${k};`)
                }
            }
        })

        nms.addFunction({
            name: 'equals',
            isExported: true,
            parameters: [p_this, p_other],
            returnType: "boolean",
            documentationComment: `Checks if each component of this ${struct} is equal to that of the other ${struct}.`,
            onWriteFunctionBody: writer => {
                let statements = properties.map((p) => {
                    return `${_this}.${p.name} === ${other}.${p.name}`
                })
                writer.write(`return ${statements.join(" && ")};`);
            }
        })

        nms.addFunction({
            name: 'equalsScalar',
            isExported: true,
            parameters: [p_this, p_k],
            returnType: "boolean",
            documentationComment: `Checks if each component of this ${struct} is equal to the specified scalar.`,
            onWriteFunctionBody: writer => {
                let statements = properties.map((p) => {
                    return `${_this}.${p.name} === ${k}`
                })
                writer.write(`return ${statements.join(" && ")};`);
            }
        })

        nms.addFunction({
            name: 'epsilonEquals',
            isExported: true,
            parameters: [p_this, p_other, p_e],
            returnType: "boolean",
            documentationComment: `Checks if each component of this ${struct} is approximately equal to that of the other ${struct}.`,
            onWriteFunctionBody: writer => {
                let statements = properties.map((p) => {
                    return `Math.abs(${_this}.${p.name} - ${other}.${p.name}) <= ${e}`
                })
                writer.write(`return ${statements.join(" && ")};`);
            }
        })

        nms.addFunction({
            name: 'epsilonEqualsScalar',
            isExported: true,
            parameters: [p_this, p_k, p_e],
            returnType: "boolean",
            documentationComment: `Checks if each component of this ${struct} is approximately equal to the specified scalar.`,
            onWriteFunctionBody: writer => {
                let statements = properties.map((p) => {
                    return `Math.abs(${_this}.${p.name} - ${k}) <= ${e}`
                })
                writer.write(`return ${statements.join(" && ")};`);
            }
        })

        nms.addFunction({
            name: 'toString',
            isExported: true,
            parameters: [p_this],
            returnType: "string",
            documentationComment: `Returns a string representation of this ${struct}.`,
            onWriteFunctionBody: writer => {
                let expressions = properties.map((p) => {
                    return `${p.name}: \${${_this}.${p.name}}`
                })
                writer.write(`return \`{ ${expressions.join(", ")} }\``);
            }
        })

        // convert class methods to functions
        for (let method of template.methods) {
            nms.addFunction({
                name: method.name,
                isExported: true,
                parameters: [p_this, ...normalizeMethodParams(method.parameters)],
                documentationComment: method.documentationComment,
                onWriteFunctionBody: writer => {
                    let node = <ts.MethodDeclaration><any>method.tsNode;
                    let methodRegex = /\bthis\.\s?([a-zA-Z_$][$\w]*?\s?\()/g;
                    let thisRegex = /\bthis\b/g;
                    for (let s of node.body.statements) {
                        // Replace methods with functions by stripping "this." from method calls
                        let text = s.getText().replace(methodRegex, (match, captured) => {
                            // and inserting "_this" as first parameter of function.
                            return captured + _this + ", ";
                        });
                        // Replace any remaning references to "this" with "_this"
                        writer.newLine().write(text.replace(thisRegex, _this));
                    }
                }
            })
        }
    }

    function generateMethodsFromFunctions(cls: tsTypeInfo.ClassDefinition, functions: tsTypeInfo.FunctionDefinition[]) {
        functions.forEach(func => {
            let params = func.parameters.slice(1);
            cls.addMethod({
                name: func.name,
                parameters: normalizeFunctionParams(params),
                documentationComment: func.documentationComment,
                onWriteFunctionBody: writer => {
                    let functionArgs = ['this', ...params.map(p => p.name)];
                    writer.write(`return ${nms.name}.${func.name}(${functionArgs.join(', ')});`);
                }
            })
        })
    }

    function generateCreatersFromSetters(cls: tsTypeInfo.ClassDefinition) {
        cls.methods
            .filter(method => method.name.indexOf("set") === 0 && method.name.charAt(3) !== " ")
            .forEach(setter => {
                let args = setter.parameters.map(p => p.name);
                let name = setter.name.substring("set".length);
                if (name === "" || name === "$") {
                    name = "create" + name;
                }
                cls.addStaticMethod({
                    name: decapitalize(name),
                    parameters: normalizeMethodParams(setter.parameters),
                    onWriteFunctionBody: writer => {
                        writer.newLine().write(`let ${struct} = new ${cls.name}();`);
                        writer.newLine().write(`${struct}.${setter.name}(${args.join(", ")});`);
                        writer.newLine().write(`return ${struct};`);
                    }
                })
            })
    }

    return outFile;
}

// Helper functions: 
function normalizeMethodParams(params: tsTypeInfo.ClassMethodParameterDefinition[]) {
    return params.map(param => {
        return {
            name: param.name,
            type: param.type.node ? param.type.node.text : param.type.text,
            isOptional: param.isOptional,
            isRestParameter: param.isRestParameter,
            defaultExpression: param.defaultExpression ? param.defaultExpression.text : null,
        }
    });
}

function normalizeFunctionParams(params: tsTypeInfo.FunctionParameterDefinition[]) {
    return params.map(param => {
        return {
            name: param.name,
            type: param.type.node ? param.type.node.text : param.type.text,
            isOptional: param.isOptional,
            isRestParameter: param.isRestParameter,
            defaultExpression: param.defaultExpression ? param.defaultExpression.text : null,
        }
    });
}

function decapitalize(str: String) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

