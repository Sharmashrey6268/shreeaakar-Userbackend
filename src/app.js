// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/auth.routes.js";
// import projectRoutes from "./routes/project.routes.js";

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "25mb" }));

// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);

// export default app;





import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shreeaakar-userfrontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "25mb" }));

// 🔥 KEEP-ALIVE ROUTE
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;
