// import { TextField, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export default function Login() {

//   const nav = useNavigate();

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#050816",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         color: "white",
//       }}
//     >
//       <div
//         style={{
//           width: "400px",
//           padding: "40px",
//           background: "#0b1225",
//           borderRadius: "20px",
//         }}
//       >
//         <h1>Login</h1>

//         <br />

//         <TextField
//           label="Email"
//           variant="outlined"
//           fullWidth
//           sx={{ mb: 3, input: { color: "white" } }}
//         />

//         <TextField
//           label="Password"
//           type="password"
//           variant="outlined"
//           fullWidth
//           sx={{ mb: 3, input: { color: "white" } }}
//         />

//         <Button
//           variant="contained"
//           fullWidth
//           onClick={() => nav("/dashboard")}
//         >
//           Login
//         </Button>
//       </div>
//     </div>
//   );
// }


import { TextField, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const nav = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030712",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          width: "420px",
          padding: "40px",
          borderRadius: "24px",
          background: "rgba(17,24,39,0.9)",
          border: "1px solid rgba(99,102,241,0.3)",
          boxShadow: "0 0 40px rgba(99,102,241,0.2)"
        }}
      >

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px"
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            color: "#9CA3AF",
            marginBottom: "35px"
          }}
        >
          AML Investigation Portal
        </p>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={{
            mb: 3,
            input: { color: "white" },
            label: { color: "#9CA3AF" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#374151"
              },
              "&:hover fieldset": {
                borderColor: "#6366F1"
              }
            }
          }}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{
            mb: 4,
            input: { color: "white" },
            label: { color: "#9CA3AF" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#374151"
              },
              "&:hover fieldset": {
                borderColor: "#6366F1"
              }
            }
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={() => nav("/dashboard")}
          sx={{
            background:
              "linear-gradient(90deg,#4F46E5,#7C3AED)",
            padding: "14px",
            borderRadius: "14px",
            fontSize: "16px",
            textTransform: "none"
          }}
        >
          Login
        </Button>

      </motion.div>
    </div>
  );
}