import com.moowork.gradle.node.yarn.YarnTask

plugins {
    id("com.github.node-gradle.node") version "2.2.4"
}

node {
    version = "12.12.0"
    npmVersion = "6.11.3"
    yarnVersion = "1.19.1"
    download = true
}

tasks {

    val reactClean by creating(Delete::class) {
        setDelete("./build")
    }

    val clean by creating {
        dependsOn(reactClean)
    }

    val yarn by getting(YarnTask::class) {

    }

    val test by creating(YarnTask::class) {
        dependsOn(yarn)
        inputs.dir("src")
        inputs.dir("public")
        inputs.file("package.json")
        outputs.dir("../test-results/client")

        setEnvironment(mapOf("CI" to "true"))
        args = listOf("test")
    }

    val build by creating(YarnTask::class) {
        dependsOn(yarn)
        mustRunAfter(reactClean)
        inputs.dir("src")
        inputs.dir("public")
        inputs.file("package.json")
        outputs.dir("build")

        setEnvironment(mapOf("CI" to "true"))
        args = listOf("build")
    }

    val check by creating {
        dependsOn(test)
    }



}
