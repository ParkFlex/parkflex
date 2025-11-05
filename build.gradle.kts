import io.ktor.plugin.OpenApiPreview

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
    implementation(libs.exposed.core)
    implementation(libs.exposed.dao)
    implementation(libs.exposed.jdbc)
    implementation(libs.h2)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.netty)
    implementation(libs.logback.classic)
    implementation(libs.ktor.server.swagger)

    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.kotlin.test.junit)
    testImplementation("io.ktor:ktor-server-test-host-jvm:3.3.1")
}

ktor {
    @OptIn(OpenApiPreview::class)
    openApi {
        title = "ParkFlex"
        //version = "2.1"
        //summary = "This is a sample API"
        //description = "This is a longer description"
        //termsOfService = "https://example.com/terms/"
        //contact = "contact@example.com"
        //license = "Apache/1.0"

        // Location of the generated specification (defaults to openapi/generated.json)
        //target = project.layout.buildDirectory.file("generated.json")
    }
}