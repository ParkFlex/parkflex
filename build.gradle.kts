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

tasks.register("apiDoc") {
    group = "documentation"

    dependsOn("clean")
    dependsOn("build")
    dependsOn("buildOpenApi")

    doLast {
        println("API Documentation generated")
    }
}

val npmBin =
    if (Os.isFamily(Os.FAMILY_WINDOWS)) "npm.exe"
    else "npm"

val npmCi = tasks.register<Exec>("npmCi") {
    group = "npm"

    workingDir("frontend/")

    commandLine(npmBin, "ci")
}

val npmBuild = tasks.register<Exec>("npmBuild") {
    group = "npm"

    dependsOn(npmCi)

    workingDir("frontend/")

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
