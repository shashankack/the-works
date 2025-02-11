import React from "react";

const LoadingScreen = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f8f8f8",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: "4px solid rgba(0, 0, 0, 0.2)",
      borderTopColor: "#d35400",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    text: {
      marginTop: "10px",
      fontSize: "1rem",
      color: "#444",
    },
    keyframes: `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `,
  };

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading, please wait...</p>
    </div>
  );
};

export default LoadingScreen;
