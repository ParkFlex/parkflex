import io.ktor.plugin.OpenApiPreview
import org.apache.tools.ant.taskdefs.condition.Os

group = "parkflex"
version = "1.0-SNAPSHOT"


plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.plugin.serialization)
    id("org.jetbrains.dokka") version "2.1.0"
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(21)
}


application {
    mainClass = "parkflex.MainKt"
}

dependencies {
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.host.common)
    implementation(libs.ktor.server.status.pages)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.exposed.core)
    implementation(libs.exposed.dao)
    implementation(libs.exposed.jdbc)
    implementation(libs.h2)
    implementation(libs.mariadb)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.netty)
    implementation(libs.logback.classic)
    implementation(libs.ktor.server.swagger)
    implementation(libs.ktor.server.cors)
    implementation(libs.exposed.java.time)
    implementation(libs.jbcrypt)

    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.kotlin.test)
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.named<Test>("test") {
    useJUnitPlatform()
}

ktor {
    @OptIn(OpenApiPreview::class)
    openApi {
        title = "ParkFlex"

        // Kinda a hack but this way we can keep the spec in the repo
        target = project.layout.projectDirectory.file("src/main/resources/openapi/generated.json")
    }
}

tasks.register("runDebug") {
    group = "application"

    doFirst {
        tasks.run.configure {
            environment(
                "ENABLE_MOCK_DATA" to "true",
                "ENABLE_H2_SOCKETS" to "true"
            )
        }
    }

    finalizedBy(tasks.run)
}

tasks.register("apiDoc") {
    group = "documentation"

    dependsOn("clean")
    dependsOn("build")
    dependsOn("buildOpenApi")

    doLast {
        println("API Documentation generated")
    }
}

tasks.register<JavaExec>("serveDokka") {
    group = "documentation"
    description = "Generate Dokka documentation and serve it on http://localhost:8001"

    dependsOn("dokkaGeneratePublicationHtml")

    mainClass.set("DokkaServer")
    
    doFirst {
        val dokkaDir = file("${layout.buildDirectory.get()}/dokka/html")
        
        if (!dokkaDir.exists()) {
            throw GradleException("Dokka documentation not found at ${dokkaDir.absolutePath}")
        }

        val serverFile = file("DokkaServer.java")
        val outputDir = file("${layout.buildDirectory.get()}/dokkaServer")
        outputDir.mkdirs()

        val javac = org.gradle.internal.jvm.Jvm.current().javacExecutable
        
        exec {
            commandLine(javac.absolutePath, "-d", outputDir.absolutePath, serverFile.absolutePath)
        }

        classpath = files(outputDir)
        args = listOf(dokkaDir.absolutePath, "8001")
    }
}

val npmBin =
    if (Os.isFamily(Os.FAMILY_WINDOWS)) "npm.cmd"
    else "npm"

val npmCi = tasks.register<Exec>("npmCi") {
    group = "npm"

    workingDir("frontend")

    commandLine(npmBin, "ci")
}

val npmBuild = tasks.register<Exec>("npmBuild") {
    group = "npm"

    dependsOn(npmCi)

    workingDir("frontend")

    commandLine(npmBin, "run", "build")
}

val fullBuild = tasks.register("fullBuild") {
    group = "build"

    dependsOn(npmBuild)
    dependsOn("build")
}

tasks.register("fullRun") {
    group = "application"

    dependsOn(fullBuild)
    finalizedBy("run")
}
