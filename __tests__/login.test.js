import request from "supertest";
import express from "express";

import { login } from "../controllers/authControllers.js";
import * as authServices from "../services/authServices.js";

jest.mock("../services/authServices.js", () => ({
  loginUser: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post("/login", login);

describe("Login Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /login", () => {
    it("should return status 200 with token and user object on successful login", async () => {
      const mockUserData = {
        token: "mock-super-jwt-token",
        user: {
          email: "test@example.com",
          subscription: "starter",
        },
      };

      const loginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      authServices.loginUser.mockResolvedValue(mockUserData);

      const response = await request(app).post("/login").send(loginCredentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.token).toBe("mock-super-jwt-token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email");
      expect(response.body.user).toHaveProperty("subscription");
      expect(typeof response.body.user.email).toBe("string");
      expect(typeof response.body.user.subscription).toBe("string");
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.subscription).toBe("starter");
    });

    it("should return status 401 on invalid credentials", async () => {
      // Arrange
      const loginCredentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const mockError = new Error("Invalid email or password");
      mockError.status = 401;

      authServices.loginUser.mockRejectedValue(mockError);

      // Act
      const response = await request(app).post("/login").send(loginCredentials);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should return status 500 on server error", async () => {
      // Arrange
      const loginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const mockError = new Error("Database connection failed");
      authServices.loginUser.mockRejectedValue(mockError);

      // Act
      const response = await request(app).post("/login").send(loginCredentials);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Database connection failed");
    });

    it("should call authServices.loginUser with correct parameters", async () => {
      // Arrange
      const mockUserData = {
        token: "mock-jwt-token",
        user: {
          email: "test@example.com",
          subscription: "pro",
        },
      };

      const loginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      authServices.loginUser.mockResolvedValue(mockUserData);

      // Act
      await request(app).post("/login").send(loginCredentials);

      // Assert
      expect(authServices.loginUser).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(authServices.loginUser).toHaveBeenCalledTimes(1);
    });

    it("should validate response structure for different subscription types", async () => {
      // Test with 'business' subscription
      const mockUserData = {
        token: "business-token-456",
        user: {
          email: "business@example.com",
          subscription: "business",
        },
      };

      authServices.loginUser.mockResolvedValue(mockUserData);

      const response = await request(app).post("/login").send({
        email: "business@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.user.subscription).toBe("business");
      expect(typeof response.body.user.subscription).toBe("string");
    });
  });
});
