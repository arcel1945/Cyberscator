const fs = require("fs");
const inquirer = require("inquirer").default;
const chalk = require("chalk").default;
const JavaScriptObfuscator = require("javascript-obfuscator");
const acorn = require("acorn");
const escodegen = require("escodegen");

function obfuscateCode(inputFile, outputFile) {
    const code = fs.readFileSync(inputFile, "utf-8");
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
    }).getObfuscatedCode();
    fs.writeFileSync(outputFile, obfuscatedCode);
    console.log(chalk.green(`Obfuscated code saved to ${outputFile}`));
}

function deobfuscateCode(inputFile, outputFile) {
    const code = fs.readFileSync(inputFile, "utf-8");
    try {
        console.log(chalk.blue("🔍 Analyzing JavaScript AST..."));
        
        // Buat AST dari kode
        const ast = acorn.parse(code, { ecmaVersion: "latest" });

        // Generate kembali kode dari AST
        const deobfuscatedCode = escodegen.generate(ast);

        fs.writeFileSync(outputFile, deobfuscatedCode);
        console.log(chalk.green(`✅ Deobfuscated code saved to ${outputFile}`));
    } catch (err) {
        console.error(chalk.red("❌ Failed to deobfuscate:", err.message));
    }
}

async function interactiveCLI() {
    console.log(chalk.blue.bold("\n🚀 Welcome to Cyberscator CLI 🚀\n"));

    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Choose an option:",
            choices: ["Obfuscate JavaScript", "Deobfuscate JavaScript", "Exit"],
        },
    ]);

    if (action === "Exit") {
        console.log(chalk.yellow("Goodbye!"));
        process.exit(0);
    }

    const { inputFile, outputFile } = await inquirer.prompt([
        {
            type: "input",
            name: "inputFile",
            message: "Enter input file path:",
        },
        {
            type: "input",
            name: "outputFile",
            message: "Enter output file path:",
        },
    ]);

    if (action === "Obfuscate JavaScript") {
        obfuscateCode(inputFile, outputFile);
    } else if (action === "Deobfuscate JavaScript") {
        deobfuscateCode(inputFile, outputFile);
    }

    interactiveCLI(); // Restart CLI setelah selesai
}

// Jalankan CLI interaktif jika tidak ada argumen tambahan
if (process.argv.length === 2) {
    interactiveCLI();
} else {
    const args = process.argv.slice(2);
    if (args[0] === "obfuscate") {
        obfuscateCode(args[1], args[2]);
    } else if (args[0] === "deobfuscate") {
        deobfuscateCode(args[1], args[2]);
    } else {
        console.log(chalk.red("Invalid command!"));
        console.log("Usage: node cyberscator.js obfuscate input.js output.js");
        console.log("       node cyberscator.js deobfuscate input.js output.js");
    }
}
