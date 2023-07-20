import gradient from "gradient-string";

const backengineGradient = gradient(["#00CB8A", "#78E0B8"]);

export const log = (message: string) => {
  const messageWithGradient = backengineGradient(`[Backengine] ${message}`);
  console.log(messageWithGradient);
};
