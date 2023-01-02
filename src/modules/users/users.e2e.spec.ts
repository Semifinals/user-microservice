import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import * as request from "supertest"
import * as shortid from "shortid"
import AppModule from "src/app.module"
import { CreateUserDto, UpdateUserDto } from "./users.params"
import { HttpStatus } from "@nestjs/common/enums"

describe("UserController", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(() => app?.close())

  const useApp = () => request(app.getHttpServer())

  describe("POST /", () => {
    it("should create a valid user", async () => {
      // Arrange
      const createUserDto = <CreateUserDto>{
        username: "User",
        verified: false,
        region: "OCE"
      }

      // Act
      const res = await useApp().post("/").send(createUserDto)

      // Assert
      expect(res.status).toBe(HttpStatus.CREATED)
      expect(res.body.username).toBe(createUserDto.username)
      expect(res.body.region).toBe(createUserDto.region)
      expect(shortid.isValid(res.body.id)).toBeTruthy()
    })

    it("should not accept an invalid types in dto", async () => {
      // Arrange
      const invalidCreateUserDto = {
        username: null,
        verified: "invalid"
      }

      // Act
      const res = await useApp().post("/").send(invalidCreateUserDto)

      // Assert
      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
    })

    it("should not accept missing properties", async () => {
      // Arrange
      const invalidCreateUserDto = {
        username: "User"
      }

      // Act
      const res = await useApp().post("/").send(invalidCreateUserDto)

      // Assert
      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
    })
  })

  describe("GET /:id", () => {
    it("should fetch an existing user", async () => {
      // Arrange
      const createUserDto = <CreateUserDto>{
        username: "User",
        verified: false,
        region: "OCE"
      }
      const postUser = await useApp().post("/").send(createUserDto)

      // Act
      const res = await useApp().get(`/${postUser.body.id}`)

      // Assert
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.id).toBe(postUser.body.id)
      expect(res.body.username).toBe(postUser.body.username)
      expect(res.body.verified).toBe(postUser.body.verified)
      expect(res.body.region).toBe(postUser.body.region)
    })

    it("should not find a non-existent user", async () => {
      // Arrange
      const randomId = shortid.generate()

      // Act
      const res = await useApp().get(`/${randomId}`)

      // Assert
      expect(res.status).toBe(HttpStatus.NOT_FOUND)
    })
  })

  describe("PATCH /:id", () => {
    // TODO: Add auth test

    it("should update with a valid complete dto", async () => {
      // Arrange
      const createUserDto = <CreateUserDto>{
        username: "User",
        verified: false,
        region: "OCE"
      }
      const postUser = await useApp().post("/").send(createUserDto)

      const updateUserDto = <UpdateUserDto>{
        username: "Updated",
        verified: true,
        region: "NA"
      }

      // Act
      const res = await useApp()
        .patch(`/${postUser.body.id}`)
        .send(updateUserDto)

      // Assert
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.id).toBe(postUser.body.id)
      expect(res.body.username).toBe(updateUserDto.username)
      expect(res.body.verified).toBe(updateUserDto.verified)
      expect(res.body.region).toBe(updateUserDto.region)
    })

    it("should accept partial updates", async () => {
      // Arrange
      const createUserDto = <CreateUserDto>{
        username: "User",
        verified: false,
        region: "OCE"
      }
      const postUser = await useApp().post("/").send(createUserDto)

      const updateUserDto = <UpdateUserDto>{
        verified: true
      }

      // Act
      const res = await useApp()
        .patch(`/${postUser.body.id}`)
        .send(updateUserDto)

      // Assert
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.id).toBe(postUser.body.id)
      expect(res.body.username).toBe(postUser.body.username)
      expect(res.body.verified).toBe(updateUserDto.verified)
      expect(res.body.region).toBe(postUser.body.region)
    })

    it("should not accept invalid dto", async () => {
      // Arrange
      const createUserDto = <CreateUserDto>{
        username: "User",
        verified: false,
        region: "OCE"
      }
      const postUser = await useApp().post("/").send(createUserDto)

      const invalidUpdateUserDto = {
        username: null,
        verified: "invalid"
      }

      // Act
      const res = await useApp()
        .patch(`/${postUser.body.id}`)
        .send(invalidUpdateUserDto)

      const get = await useApp().get(`/${postUser.body.id}`)

      // Assert
      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
      expect(get.body.id).toBe(postUser.body.id)
      expect(get.body.username).toBe(postUser.body.username)
      expect(get.body.verified).toBe(postUser.body.verified)
      expect(get.body.region).toBe(postUser.body.region)
    })

    it("should not update non-existent user", async () => {
      // Arrange
      const randomId = shortid.generate()

      const updateUserDto = <UpdateUserDto>{
        username: "Updated",
        verified: true,
        region: "NA"
      }

      // Act
      const res = await useApp().patch(`/${randomId}`).send(updateUserDto)

      // Assert
      expect(res.status).toBe(HttpStatus.NOT_FOUND)
    })
  })

  describe("DELETE /:id", () => {
    // TODO: Add auth test

    it("should accept valid request", async () => {
      // Arrange
      const createUserDto = <CreateUserDto>{
        username: "User",
        verified: false,
        region: "OCE"
      }
      const postUser = await useApp().post("/").send(createUserDto)

      // Act
      const res = await useApp().delete(`/${postUser.body.id}`)

      const get = await useApp().get(`/${postUser.body.id}`)

      // Assert
      expect(res.status).toBe(HttpStatus.NO_CONTENT)
      expect(get.status).toBe(HttpStatus.NOT_FOUND)
    })

    it("should not delete non-existent user", async () => {
      // Arrange
      const randomId = shortid.generate()

      // Act
      const res = await useApp().delete(`/${randomId}`)

      // Assert
      expect(res.status).toBe(HttpStatus.NOT_FOUND)
    })
  })
})
