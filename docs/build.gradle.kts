import org.antora.gradle.AntoraTask

plugins {
    id("org.antora") version "1.0.0"
    id("base")
    id("pl.zalas.structurizr-cli") version "1.9.0"
}

val workspacePath = "${projectDir}/structurizr"
val destinationPath = "${projectDir}/modules/arcdoc/examples/generated"

antora {
    playbook.set(file("antora-local.yml"))
    environment.put("SKIP_CONFLUENCE", "true")
}

structurizrCli {
    export {
        format = "plantuml/c4plantuml"
        workspace = "${workspacePath}/chinook-workspace.dsl"
        output = destinationPath
        name = "chinook-%s.puml"

    }
}


tasks.register<Delete>("cleanStructurizrFiles") {
    group = "documentation"
    description = "Delete generated PlantUML files."
    delete(fileTree(destinationPath).matching {
        include("structurizr-*.puml")
    })
}

tasks.named<AntoraTask>("antora") {
    group = "documentation"
    dependsOn("structurizrCliExport", "npmCiOrInstall")
}

