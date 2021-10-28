const {ApolloServer, gql} = require("apollo-server")

const port = process.env.PORT || 3000

//Schemas
// Resolvers

const blogPosts = [
    {
        title: "Harry Kaine and the Chamber of Secrets",
        author: "J.K Rowlings",
        blogMessage: "Lorem ipsum filler text",
        likes: 1,
        unlikes: 1,
        comments: [],
        banner: "Image Source"
    },
    {
        title: "Jurassic Park",
        author: "Micheal Crichton",
        blogMessage: "Lorem ipsum filler text",
        likes: 2,
        unlikes: 3,
        comments: [],
        banner: "Image Source"
    },
];


const schemas = gql`
    type BlogPost {
        title: String!
        author: String!
        blogMessage: String
        likes: Int
        comments: [String]
        banner: String
    }

    type Query {
        blogPosts: [BlogPost]
        blog(title: String!): BlogPost
    }

    type Mutation {
        createBlog(title: String!, author: String!): BlogPost
        likeBlog(title: String!): BlogPost
        unLikeBlog(title: String!): BlogPost
    }
`;   

const blogsResolvers = {
    Query: {
        blogPosts: () => blogPosts,
        blog: (parent, args) => blogPosts.find(blog => blog.title === args.title)
    },
    Mutation: {
        createBlog:  (parent, args) => {
            const { title, author, likes } = args;
            const blog = { title, author, likes: 0 };
            blogPosts.push(blog);
            return blog;
        },
        likeBlog: (parent, args) => {
            const blog = blogPosts.find(blog => blog.title === args.title)
            blog.likes+=1
            return blog
        },
        unLikeBlog: (parent, args) => {
            const blog = blogPosts.find(blog => blog.title === args.title)
            blog.likes+=1
            return blog
        }
    }
}

const server = new ApolloServer({ 
    typeDefs: schemas, 
    resolvers: blogsResolvers,
    playground: true,
    introspection: true
 });

server.listen( port ).then(({ url, port }) => {
    console.log(`Server ready at ${url}`)
}).catch(err => console.log(err));

