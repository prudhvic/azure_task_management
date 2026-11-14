import "dotenv/config";
import { pool } from "./db/config.js";
import { app } from "./app.js";
const PORT = process.env.PORT || 5000;
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});
console.log("Starting server...", PORT);
async function startServer() {
    try {
        await pool.query("SELECT 1");
        console.log("Azure PostgreSQL connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map