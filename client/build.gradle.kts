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

    val yarn by getting(YarnTask::class) {

    }

    val test by creating(YarnTask::class) {
        dependsOn(yarn)
        setEnvironment(mapOf("CI" to "true"))
        args = listOf("test")
    }

    val build by creating(YarnTask::class) {
        dependsOn(yarn)
        setEnvironment(mapOf("CI" to "true"))
        args = listOf("build")
    }

    val check by creating {
        dependsOn(test)
    }

}
