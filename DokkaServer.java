import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.Files;

public class DokkaServer {
    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.err.println("Usage: java DokkaServer <dokka_dir> <port>");
            System.exit(1);
        }

        File dokkaDir = new File(args[0]);
        int port = Integer.parseInt(args[1]);

        if (!dokkaDir.exists()) {
            System.err.println("Error: Dokka documentation not found at " + dokkaDir.getAbsolutePath());
            System.exit(1);
        }

        System.out.println("Starting HTTP server at http://localhost:" + port);
        System.out.println("Serving Dokka documentation from: " + dokkaDir.getAbsolutePath());
        System.out.println("Press Ctrl+C to stop the server");
        System.out.println();

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            if ("/".equals(path)) {
                path = "/index.html";
            }

            File file = new File(dokkaDir, path);

            if (file.exists() && file.isFile() && 
                file.getCanonicalPath().startsWith(dokkaDir.getCanonicalPath())) {

                String contentType = getContentType(path);
                
                exchange.getResponseHeaders().set("Content-Type", contentType);
                exchange.sendResponseHeaders(200, file.length());
                try (OutputStream out = exchange.getResponseBody();
                     FileInputStream in = new FileInputStream(file)) {
                    byte[] buffer = new byte[8192];
                    int n;
                    while ((n = in.read(buffer)) > 0) {
                        out.write(buffer, 0, n);
                    }
                }
            } else {
                String response = "404 Not Found";
                exchange.sendResponseHeaders(404, response.length());
                try (OutputStream out = exchange.getResponseBody()) {
                    out.write(response.getBytes());
                }
            }
        });

        server.start();

        try {
            if (java.awt.Desktop.isDesktopSupported()) {
                java.awt.Desktop.getDesktop().browse(new java.net.URI("http://localhost:" + port));
            }
        } catch (Exception e) {
            // Desktop API might not be available
        }

        System.out.println("Server started successfully!");
        System.out.println("Open http://localhost:" + port + " in your browser");

        Thread.currentThread().join();
    }

    private static String getContentType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".json")) return "application/json";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".woff")) return "font/woff";
        if (path.endsWith(".woff2")) return "font/woff2";
        return "application/octet-stream";
    }
}
