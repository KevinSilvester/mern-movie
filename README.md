# ~~MERN Stack~~ Movie Website

> Demo at <a href="https://moviedb.kevins.site" target="_blank">https://moviedb.kevins.site</a>

A full-stack application built using:

- TypeScript
- Rust
- Bun
- React
- Axum
- MongoDB

---

### Screenshots

> UI design heavily inspired by <a href="https://anilist.co/search/anime" target="_blank">https://anilist.co/search/anime</a>

![Screen 3](./.github/screenshots/screen-3.png)
![Screen 4](./.github/screenshots/screen-4.png)
![Screen 5](./.github/screenshots/screen-5.png)
![Screen 6](./.github/screenshots/screen-6.png)
<img alt="Mobile Screen 1" src="./.github/screenshots/mob-screen-1.jpg"  height="850" />
<img alt="Mobile Screen 2" src="./.github/screenshots/mob-screen-2.jpg"  height="850" />
<img alt="Mobile Screen 3" src="./.github/screenshots/mob-screen-3.jpg"  height="850" />
<img alt="Mobile Screen 4" src="./.github/screenshots/mob-screen-4.jpg"  height="850" />
<img alt="Mobile Screen 5" src="./.github/screenshots/mob-screen-5.jpg"  height="850" />
<img alt="Mobile Screen 6" src="./.github/screenshots/mob-screen-6.jpg"  height="850" />

---

### Project Structure

- **`api-server`**:
  - The API for the app publicly accessible at <https://moviedb-api.kevins.site>
  - Written in Rust using Axum web-framework and Tokio async runtime

- **`client-app`**:
  - The client-side website built with ReactJS

- **`client-server`**:
  - Serves the static files generated after the `client-app` build process at <https://moviedb.kevins.site>
  - Written in Rust using Axum web-framework and Tokio async runtime

### Features

- Create,Read,Update and Delete movies (CRUD operation)
- Full database reset with a daily limit
- Responsive UI with light and dark theme
- Fuzzy search, sort, filter (using `URLQueryParams`)
- Dynamic import/code splitting for smaller bundle size
- Custom selection component (not yet keyboard accessible)
- Loading skeleton for images, text and iframes
- Fallback image for missing poster links
- Extra info (i.e. Banner, YouTube trailer, IMDb link)

---

### Quick Start

##### Requirements

- [bun](https://bun.com/) (minimum v1.2.x)
- [rust toolchain](https://www.rust-lang.org) (minimum v1.89.x)
- MongoDB Atlas (required for `search` aggregation)
- TheMovieDB API key (<a href="https://developers.themoviedb.org/3/getting-started/introduction" target="_blank">More Info</a>)

##### Setup

1. **Create <a href="https://www.mongodb.com/atlas/database" target="_blank">MongoDB Atlas</a> Account**
   <br />
   After account is made...
   - Create a `New Project`
   - Create a new Database Cluster in that project
   - Add a new Collection called `movies` to database
   - Create a Search Index using index definition (See [mongo-index-def.json](https://github.com/KevinSilvester/mern-movie/blob/main/api-server/mongo-search-index-def.json))

2. **Install Dependencies**

   ```sh
   # client-app dependenices
   bun install
   ```

3. **Make a `.env` file in the `./api-server` directory**<br />

   > Example: [.env.example](https://github.com/KevinSilvester/mern-movie/blob/main/api-server/.env.example)

   ```sh
   # Cloudflare secrets to upload and delete images from R2 storage bucket
   CLOUDFLARE_ACCOUNT_ID=
   CLOUDFLARE_ACCESS_KEY_ID=
   CLOUDFLARE_SECRET_ACCESS_KEY=
   CLOUDFLARE_R2_BUCKET=

   # Mongodb Atlas connection details
   MONGO_CONNECTION_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<PROJECT_NAME>.???.???.???
   MONGO_DB_NAME=
   MONGO_SEARCH_INDEX=

   # TheMovieDB Access Token for request `Authorization` header
   TMDB_ACCESS_TOKEN=

   # A custom api token to bypass the limit on number of request on the `reset` endpoint
   # can be generated with `openssl rand -hex 128`
   MOVIEDB_API_ADMIN_TOKEN=
   ```

4. **Start the `api-server`:**

   The api-server uses an in memory cache for responses from TMDB. This primarily to speed up database the reset operation where some details for a movie
   are retrieved from TMDB.

   Since the cache is in-memory, it gets wiped when you have restart the server, which happens a lot when developing.

   To counter this issue, there is an optional [build feature](https://doc.rust-lang.org/cargo/reference/features.html) `tmdb-cache-file` for the `api-server` crate.
   When this feature is present, responses from TMDB will be cached in-memory AND the will be written to a binary file.
   This allows for subsequent restarts of the server with `tmdb-cache-file` feature present, to read the binary files before the server starts, so that the cache is
   pre-populated.

   ```sh
   # to start the server locally with in-memory caching
   cd api-server && cargo run
   ```

   ```sh
   # to start the server with file and in-memory caching
   cd api-server && cargo run --features tmdb-cache-file
   ```

   It is also possible to select the logging formats, logging level and port number the server runs on in the start command.

   ```sh
   # Running this command will:
   # 1. Enable the 'tmdb-cache-file' build feature
   # 2. Set the port number of the server to 4000
   # 3. Set the format of the logged text to json
   # 4. Set the log level of the server to 'info' (the lowest level is 'trace')
   cargo run --features tmdb-cache-file -- --port 4000 --log-format json --log-level info
   ```

   You can see all the available runtime options by running:

   ```sh
   cargo run -- --help
   ```

5. **Start the `client-app`**

   ```sh
   # to start client-app
   cd client-app && bun run dev
   ```

6. **Start the `client-server` <i>(Optional)</i>**

   Before running this server, the `client-app` must be built and bundled by running:

   ```sh
   cd client-app && bun run build
   ```

   If successful, this should generate the bundled production output of the `client-app` in the location
   `./client-app/dist/`.

   Once built, start the server by providing the relative or absolute path to the static files the server should serve:

   ```sh
   cd client-server
   cargo run -- ../client-app/dist

   # the 'client-server' has similar option to api-server
   # to select the server port
   cargo run -- --port 3000 ../client-app/dist
   ```

### Key Dependencies/Packages

- ##### Both servers

  |                    <!-- -->                     | <!-- -->                                                                                     |
  | :---------------------------------------------: | :------------------------------------------------------------------------------------------- |
  |      [axum](https://crates.io/crates/axum)      | Web framework that focuses on ergonomics and modularity                                      |
  |      [clap](https://crates.io/crates/clap)      | A simple to use, efficient, and full-featured Command Line Argument Parser                   |
  |  [mimalloc](https://crates.io/crates/mimalloc)  | Performance and security oriented drop-in allocator                                          |
  |     [tokio](https://crates.io/crates/tokio)     | An event-driven, non-blocking I/O platform for writing asynchronous I/O backed applications. |
  |     [serde](https://crates.io/crates/serde)     | A generic serialization/deserialization framework                                            |
  | [validator](https://crates.io/crates/validator) | Request validation                                                                           |

- ##### api-server

  |                     <!-- -->                      | <!-- -->                                                                                                                                                         |
  | :-----------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | [aws-skd-s3](https://crates.io/crates/aws-skd-s3) | For file upload to Cloudflare R2                                                                                                                                 |
  |    [bincode](https://crates.io/crates/bincode)    | A binary serialization / deserialization strategy for transforming structs into bytes and vice versa! (For caching to file when using `tmdb-file-cache` feature) |
  |       [moka](https://crates.io/crates/moka)       | A fast and concurrent cache library inspired by Java Caffeine                                                                                                    |
  |    [mongodb](https://crates.io/crates/mongodb)    | The official MongoDB driver for Rust                                                                                                                             |
  |    [mongodb](https://crates.io/crates/mongodb)    | The official MongoDB driver for Rust                                                                                                                             |

- ##### client-app

  |                                <!-- -->                                 | <!-- -->                                        |
  | :---------------------------------------------------------------------: | :---------------------------------------------- |
  |                [TypeScript](https://typescriptlang.org)                 | Type safe code                                  |
  |                         [Zod](https://zod.dev/)                         | Schema based validation                         |
  |                     [Axios](https://axios-http.com)                     | HTTP client for browser and node.js             |
  |                     [Prettier](https://prettier.io)                     | Code formatter                                  |
  |                      [Eslint](https://eslint.org)                       | Code Linting                                    |
  |                      [ViteJs](https://vitejs.dev/)                      | A rapid development tool                        |
  |                      [React](https://reactjs.org/)                      | Front-end JavaScript library                    |
  |             [React-Router](https://reactrouter.com/en/main)             | Client-side routing with React                  |
  |                [Zustand](https://zustand-demo.pmnd.rs/)                 | A bear-bone state-management tool               |
  |              [React Query](https://tanstack.com/query/v4)               | Caching, managing and syncing asynchronous data |
  |             [Framer Motion](https://www.framer.com/motion/)             | For smooth animated transitions/interactions    |
  |                   [Popper.js](https://popper.js.org)                    | Popover positioning engine                      |
  |             [React-Hook-Form](https://react-hook-form.com/)             | Performant form validation                      |
  | [React-Toastify](https://fkhadra.github.io/react-toastify/introduction) | Toast notification in React                     |
  |                 [Filepond](https://pqina.nl/filepond/)                  | JavaScript file upload library                  |
