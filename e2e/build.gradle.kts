import com.moowork.gradle.node.yarn.YarnTask

plugins {
    id("com.github.node-gradle.node") version "1.3.0"
}

node {
    version = "12.10.0"
    npmVersion = "6.11.3"
    yarnVersion = "1.17.3"
    download = true
}

tasks {

    val yarn by getting(YarnTask::class) {

    }

    val endToEnd by creating(YarnTask::class) {
        dependsOn(yarn, ":client:build", ":server:build")
        setEnvironment(mapOf("CI" to "true"))
        args = listOf("e2e")
    }

    val check by creating {
        dependsOn(endToEnd)
    }

}
