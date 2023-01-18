const mongoose = require("mongoose");
const request = require("supertest");

let mockPost = {
    name: "Jest",
    email: "jest@test.com",
    content: 'Jest testing'
}

/* Testing the API endpoints. */

/* Testing GET endpoint */
describe("GET /api/posts/all", () => {
    it("should return array of posts", async () => {
        return request('http://localhost:3000/')
        .get("api/post/all")
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual(
                expect.objectContaining({
                    result: expect.any(Array)
                })
            )
        })
    });

    it("should return array of objects with properties if array not empty", async () => {
        return request('http://localhost:3000/')
        .get("api/post/all")
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        email: expect.any(String),
                        content: expect.any(String)
                    })
                ])
            )
        })
    });
});

/* Testing POST endpoint*/
describe("POST /api/posts/createPost", () => {
    it("should create post", async () => {
        return request('http://localhost:3000/')
        .post("api/post/createPost")
        .send({
            name: mockPost.name,
            email: mockPost.email,
            content: mockPost.content,
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
            mockPost._id = response.body.result._id;
            expect(response.body.result).toEqual(
                expect.objectContaining({
                    name: mockPost.name,
                    email: mockPost.email,
                    content: mockPost.content,
                    profilePic: null,
                    cloudinaryId: null
                })
            )
        })
    });

    it("should return status 400 if content is invalid", async () => {
        return request('http://localhost:3000/')
        .post("api/post/createPost")
        .send({
            content: '    '
        })
        .expect('Content-Type', /json/)
        .expect(400)
    });

    it("should return status 400 if the fields are invalid", async () => {
        return request('http://localhost:3000/')
        .post("api/post/createPost")
        .send({
            completed: 'true'
        })
        .expect('Content-Type', /json/)
        .expect(400)
    });
});

/* Testing PUT endpoint */
describe("PUT /api/posts/update", () => {
    it("should update post", async () => {
        return request('http://localhost:3000/')
        .put("api/post/update")
        .send({
            _id: mockPost._id,
            name: 'Jest superTest'
        })
        .expect('Content-Type', /json/)
        .expect(200)
    });
});

/* Testing DELETE endpoint */
describe("PUT /api/posts/remove", () => {
    it("should remove post", async () => {
        return request('http://localhost:3000/')
        .delete("api/post/remove")
        .send({
            _id: mockPost._id
        })
        .expect(202)
    });

    it("should return status 500 if wrong input", async () => {
        return request('http://localhost:3000/')
        .delete("api/post/remove")
        .send({
            _id: 'asdf'
        })
        .expect(500)
    });
});

