import request from 'supertest';
import app from '../src/app.js';
import { usersDb } from '../src/db/usersDb.js';

describe('Login /api/login (flujo completo con "BD")', () => {
  beforeEach(() => {
    usersDb.length = 0;
    usersDb.push({
      id: 1,
      email: 'admin@example.com',
      password: '123456'
    });
  });

  it('1) Login exitoso con credenciales correctas', async () => {
    const loginData = {
      email: 'admin@example.com',
      password: '123456'
    };

    const res = await request(app).post('/api/login').send(loginData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login exitoso');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id', 1);
    expect(res.body.user).toHaveProperty('email', 'admin@example.com');
    expect(res.body).toHaveProperty('token');
  });

  it('2) Falla si faltan campos (sin contraseña)', async () => {
    const loginData = {
      email: 'admin@example.com'
    };

    const res = await request(app).post('/api/login').send(loginData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Email y contraseña son obligatorios'
    );
  });

  it('3) Falla si el usuario no existe en la BD', async () => {
    const loginData = {
      email: 'noexiste@example.com',
      password: '123456'
    };

    const res = await request(app).post('/api/login').send(loginData);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Usuario no encontrado');
  });

  it('4) Falla si la contraseña es incorrecta', async () => {
    const loginData = {
      email: 'admin@example.com',
      password: 'clave_incorrecta'
    };

    const res = await request(app).post('/api/login').send(loginData);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Credenciales inválidas');
  });
});
