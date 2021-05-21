import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  it('1) Should /GET /api/v1/statements/balance to recover user balance', async () => {
    const mocked_user = {
      name: "Teste",
      email: "teste@email.com",
      password: "123"
    };

    const authenticationResponse = await request(app).post('/api/v1/sessions').send({
      email: mocked_user.email,
      password: mocked_user.password
    });
    const { token } = authenticationResponse.body;

    const balanceResponse = await request(app).get('/api/v1/statements/balance').send().set({
      Authorization: `Bearer ${token}`
    });

    expect(balanceResponse.status).toBe(200);
    expect(balanceResponse.body).toHaveProperty("balance");
  });

  it('2) Should /GET /api/v1/statements/balance and dont recover balance of non authenticated user', async () => {
    const balanceResponse = await request(app).get('/api/v1/statements/balance').send();

    expect(balanceResponse.status).toBe(401);
    expect(balanceResponse.body).toStrictEqual({"message": "JWT token is missing!"});
  });
});
