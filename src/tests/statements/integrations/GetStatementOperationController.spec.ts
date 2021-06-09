import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../app";

let connection: Connection;

const mocked_user = {
  name: "Teste",
  email: "teste@email.com",
  password: "123"
};

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await request(app).post('/api/v1/users').send({name: mocked_user.name, email: mocked_user.email, password: mocked_user.password});
  });

  it('1) Should /GET /api/v1/statements/:statement_id to recover statement operation', async () => {
  const authenticationResponse = await request(app).post('/api/v1/sessions').send({ email: mocked_user.email, password: mocked_user.password });
    const { token } = authenticationResponse.body;

    const statementResponse = await request(app).post('/api/v1/statements/deposit')
    .send({
        amount: 100,
        description: "deposit"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const { id } = statementResponse.body;

    const statementOperationResponse = await request(app).get(`/api/v1/statements/${id}`).send().set({
      Authorization: `Bearer ${token}`
    });

    expect(statementOperationResponse.status).toBe(200);
    expect(statementOperationResponse.body).toHaveProperty('id');
  });

  it('2) Should /GET /api/v1/statements/:statement_id and dont recover statement operation from non authenticated user', async () => {
    const statement_id  = 'b5445d57-7e3d-4675-bd4e-7e246eb50791';
    const statementOperationResponse = await request(app).get(`/api/v1/statements/${statement_id}`).send();

    expect(statementOperationResponse.status).toBe(401);
    expect(statementOperationResponse.body).toStrictEqual({"message": "JWT token is missing!"});
  });

  it('3) Should /GET /api/v1/statements/:statement_id and dont recover non existent statement operation', async () => {
    const authenticationResponse = await request(app).post('/api/v1/sessions').send({email: mocked_user.email, password: mocked_user.password});
    const { token } = authenticationResponse.body;
    const statement_id  = 'b5445d57-7e3d-4675-bd4e-7e246eb50791';

    const statementOperationResponse = await request(app).get(`/api/v1/statements/${statement_id}`).send().set({
      Authorization: `Bearer ${token}`
    });

    expect(statementOperationResponse.status).toBe(404);
    expect(statementOperationResponse.body).toStrictEqual({ message: 'Statement not found' })
  });
});
