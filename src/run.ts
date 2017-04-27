import File = require('vinyl');
import * as ts from "typescript";
import * as tsTypeInfo from "ts-type-info";
import * as through2 from 'through2';

export default function run() {
    return through2.obj(function (file: File, encoding, callback) {
        let info = tsTypeInfo.getInfoFromFiles([file.path], { includeTsNodes: true });
        console.log(info);
        let srcFile = info.getFile(f =>
            f.fileName.indexOf(file.relative) !== -1
        )
        if (srcFile) {
            srcFile.imports.forEach(imprt => console.log(imprt.moduleSpecifier))
            // File must contain Template import and class extending Template
            let templateImport = srcFile.getImport(imprt =>
                imprt.moduleSpecifier.indexOf('gulp-structify') !== -1
            )
            let templateSubclass = srcFile.getClass(cls =>
                cls.extendsTypes.some(ext => ext.text.indexOf("Template<") !== -1)
            )
            if (templateImport && templateSubclass) {
                // Remove Template import and class from file
                srcFile.imports = srcFile.imports.filter(imprt => imprt !== templateImport);
                srcFile.classes = srcFile.classes.filter(cls => cls !== templateSubclass);
                // Generate code from template write to file
                generateFileFromTemplate(templateSubclass, srcFile);
                file.contents = new Buffer(srcFile.write());
            }
        }
        callback(null, file);
    });
};

function generateFileFromTemplate(template: tsTypeInfo.ClassDefinition, file: tsTypeInfo.FileDefinition) {
    // destructure src file
    let struct = template.name;
    let properties = template.properties;
    let structDoc = template.documentationComment;
    let structLength = properties.length;
    let arrayType = template.extendsTypes[0].typeArguments[0].text;
    let components = properties.map(p => {
        return { name: p.name, type: p.type.text };
    });

    // At beginning of file:
    file.onBeforeWrite = writer => {
        writer.write("// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n")
    }

    // Add struct and buf imports
    file.addImport({
        moduleSpecifier: 'gulp-structify',
        namedImports: [{ name: "Structure" }, {name: "StructureBuffer"}]
    });

    // Generate interface matching template
    file.addInterface({
        name: struct,
        properties: properties.map(p => {
            return {
                name: p.name,
                type: p.type.text,
                documentationComment: p.documentationComment,
            }
        }),
        documentationComment: structDoc,
        onAfterWrite: writer => {
            writer.write(`export { ${struct} as _};`)
        }
    });

    // Copy any functions contained in file
    file.functions.forEach(f => {
        if (f.tsNode) {
            let node = <ts.FunctionDeclaration><any>f.tsNode;
            f.onWriteFunctionBody = writer => {
                for (let s of node.body.statements) {
                    writer.newLine().write(s.getText());
                }
            }
        }
    })

    // Generate functions specified by decorators
    let generatedFunctions = generateFunctionsFromTemplate(template);

    // generate "Obj" class
    let objClass = file.addClass({
        isExported: true,
        name: "Obj",
        properties: properties.map(p => {
            return {
                name: p.name,
                type: p.type.text,
                documentationComment: p.documentationComment,
            }
        }),
        documentationComment: structDoc,
    });
    generateMethodsFromFunctions(objClass, generatedFunctions);
    generateCreatersFromSetters(objClass);

    // Generate "Struct" class
    let structClass = file.addClass({
        name: "Struct",
        isExported: true,
        extendsTypes: [`Structure<${arrayType}>`],
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
    generateMethodsFromFunctions(structClass, generatedFunctions);
    generateCreatersFromSetters(structClass);

    // Generate "Buf" class
    let bufClass = file.addClass({
        isExported: true,
        name: "Buf",
        documentationComment: `A ${struct} buffer backed by a ${arrayType}.`,
        extendsTypes: [`StructureBuffer<${arrayType}>`],
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
    generatedFunctions.forEach((f) => {
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
                writer.write(`return ${f.name}(${functionArgs.join(', ')});`);
            }
        })
    })

    function generateFunctionsFromTemplate(cls: tsTypeInfo.ClassDefinition) {

        // create function parameters
        let _this = "_this";
        let other = "other";
        let e = "e";
        let k = "k";

        let p_this = { name: _this, type: struct };
        let p_other = { name: other, type: struct };
        let p_k = { name: k, type: 'number' };
        let p_e = { name: e, type: 'number' };

        // Get current function count
        let originalFunctionCount = file.functions.length;

        // Generate automatic template functions
        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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

        file.addFunction({
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
        for (let m of cls.methods) {
            file.addFunction({
                name: m.name,
                isExported: true,
                parameters: [p_this, ...normalizeMethodParams(m.parameters)],
                documentationComment: m.documentationComment,
                onWriteFunctionBody: writer => {
                    let node = <ts.MethodDeclaration><any>m.tsNode;
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

        // return all the functions added by this method
        return file.functions.slice(originalFunctionCount);
    }

    function generateMethodsFromFunctions(cls: tsTypeInfo.ClassDefinition, functions: tsTypeInfo.FunctionDefinition[]) {
        functions.forEach(f => {
            let params = f.parameters.slice(1);
            cls.addMethod({
                name: f.name,
                parameters: normalizeFunctionParams(params),
                documentationComment: f.documentationComment,
                onWriteFunctionBody: writer => {
                    let functionArgs = ['this', ...params.map(p => p.name)];
                    writer.write(`return ${f.name}(${functionArgs.join(', ')});`);
                }
            })
        })
    }

    function generateCreatersFromSetters(cls: tsTypeInfo.ClassDefinition) {
        cls.methods
            .filter(m => m.name.indexOf("set") === 0 && m.name.charAt(3) !== " ")
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
}

// Helper functions: 
function normalizeMethodParams(params: tsTypeInfo.ClassMethodParameterDefinition[]) {
    return params.map(p => {
        return {
            name: p.name,
            type: p.type.node ? p.type.node.text : p.type.text,
            isOptional: p.isOptional,
            isRestParameter: p.isRestParameter,
            defaultExpression: p.defaultExpression ? p.defaultExpression.text : null,
        }
    });
}

function normalizeFunctionParams(params: tsTypeInfo.FunctionParameterDefinition[]) {
    return params.map(p => {
        return {
            name: p.name,
            type: p.type.node ? p.type.node.text : p.type.text,
            isOptional: p.isOptional,
            isRestParameter: p.isRestParameter,
            defaultExpression: p.defaultExpression ? p.defaultExpression.text : null,
        }
    });
}

function decapitalize(str: String) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

