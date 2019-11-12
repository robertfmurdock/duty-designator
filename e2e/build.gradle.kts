import com.moowork.gradle.node.yarn.YarnTask

plugins {
    id("com.github.node-gradle.node") version "1.3.0"
}

node {
    version = "12.12.0"
    npmVersion = "6.11.3"
    yarnVersion = "1.19.1"
    download = true
}

tasks {
    val testResultsClean by creating(Delete::class) {
        setDelete("../test-results/e2e")
    }

    val clean by creating {
        dependsOn(testResultsClean)
    }

    val yarn by getting(YarnTask::class) {
    }

    val endToEnd by creating(YarnTask::class) {
        dependsOn(yarn, ":client:build", ":server:build")
        mustRunAfter(":server:check")

        val clientBuildFiles = findByPath(":client:build")!!.outputs.files
        inputs.files(clientBuildFiles)
        val serverBuildFiles = findByPath(":server:goBuild")!!.outputs.files
        inputs.files(serverBuildFiles)
        inputs.dir("cypress/fixtures")
        inputs.dir("cypress/integration")
        inputs.dir("cypress/plugins")
        inputs.file("package.json")
        outputs.dir("../test-results/e2e")

        setEnvironment(mapOf("CI" to "true"))
        args = listOf("e2e")
    }

    val check by creating {
        dependsOn(endToEnd)
    }

}
