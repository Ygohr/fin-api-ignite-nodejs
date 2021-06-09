import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../app";

let connection: Connection;

const mocked_user = {
  name: "Teste",
  email: "teste@email.com",
  password: "123"
};

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await request(app).post('/api/v1/users').send({name: mocked_user.name, email: mocked_user.email, password: mocked_user.password});
  });

  it('1) Should /POST /api/v1/statements/deposit to create a statement of type deposit', async () => {
    const authenticationResponse = await request(app).post('/api/v1/sessions').send({
      email: mocked_user.email,
      password: mocked_user.password
    });
    const { token } = authenticationResponse.body;

    const statementResponse = await request(app).post('/api/v1/statements/deposit')
    .send({
        amount: 5,
        description: "deposit"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(statementResponse.status).toBe(201);
    expect(statementResponse.body).toHaveProperty('id');
  });

  it('2) Should /POST /api/v1/statements/withdraw to create a statement of type withdraw', async () => {
    const authenticationResponse = await request(app).post('/api/v1/sessions').send({
      email: mocked_user.email,
      password: mocked_user.password
    });
    const { token } = authenticationResponse.body;

    const statementResponse = await request(app).post('/api/v1/statements/withdraw')
    .send({
        amount: 1,
        description: "withdraw"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(statementResponse.status).toBe(201);
    expect(statementResponse.body).toHaveProperty('id');
  });

  it('3) Should /POST /api/v1/statements/deposit and not be able to create a statement to non authenticated user', async () => {
    const statementResponse = await request(app).post('/api/v1/statements/deposit')
    .send({
        amount: 1000,
        description: "deposit"
    });

    expect(statementResponse.status).toBe(401);
    expect(statementResponse.body).toStrictEqual({"message": "JWT token is missing!"});
  });
});
