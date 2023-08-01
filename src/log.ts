import gradient from "gradient-string";

const backengineGradient = gradient(["#00CB8A", "#78E0B8"]);
const errorGradient = gradient(["#FF5733", "#FF5733"]);

export const log = (message: string) => {
  const messageWithGradient = backengineGradient(`[Backengine] ${message}`);
  console.log(messageWithGradient);
};

export const logError = (message: string, error: any) => {
  if (error instanceof Error) {
    const errorMessageWithGradient = errorGradient(
      `[Backengine] ${error.message}`
    );
    console.error(errorMessageWithGradient);
  } else {
    console.error(error);
  }
  const messageWithGradient = errorGradient(`[Backengine] ${message}`);
  console.error(messageWithGradient);
};
