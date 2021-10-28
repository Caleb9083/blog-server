const {ApolloServer, gql} = require("apollo-server")

const port = process.env.PORT || 3000

//Schemas
// Resolvers

const blogPosts = [
    {
        title: "Make Money",
        author: "J.K Rowlings",
        blogMessage: "Lorem ipsum filler text",
        likes: 1,
        unlikes: 1,
        comments: [{ message: "I am commenting", reply: [{rep: "I have replied 1"}] },
        { message: "This is my next comment", }
    ],
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
    type Reply {
        rep: String!
    }

    type Comment {
        message: String!
        reply: [Reply]
    }

    type BlogPost {
        title: String!
        author: String!
        blogMessage: String
        likes: Int
        unlikes: Int
        comments: [Comment]
        banner: String
    }

    type Query {
        blogPosts: [BlogPost]
        blog(title: String!): BlogPost
    }

    type Mutation {
        createBlog(title: String!, author: String!, blogMessage: String!): BlogPost
        likeBlog(title: String!): BlogPost
        unLikeBlog(title: String!): BlogPost
        updateBlog(
            title: String!,
            newTitle: String,
            author: String,
            blogMessage: String,
            banner: String
        ): BlogPost
        commentOnBlog(title: String!, comments: String!): BlogPost
        deleteBlog(title: String!): BlogPost
    }
`;   

const blogsResolvers = {
    Query: {
        blogPosts: () => blogPosts,
        blog: (parent, args) => blogPosts.find(blog => blog.title === args.title)
    },
    Mutation: {
        createBlog:  (parent, args) => {
            const { title, author, blogMessage, } = args;
            const blog = { title, author, blogMessage, likes: 0 , unlikes: 0, comments: [] };
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
        },
        updateBlog: (parent, args) => {
            const blog = blogPosts.find(blog => blog.title === args.title) 
            if (blog){
                blog.title = args.newTitle ? args.newTitle : args.title
                blog.author = args.author
                blog.blogMessage = args.blogMessage
                blog.banner = args.banner
                return blog
            }else{
                return "Blog not found"
            }    
        },
        commentOnBlog: (parent, args) => {
            const blog = blogPosts.find(blog => blog.title === args.title)
            if (blog && args.comments ){
                blog.comments.push({message: args.comments })
            }
        },
        deleteBlog: (parent, args) => {
            const blog = blogPosts.find(blog => blog.title === args.title)
            if (blog) {
                const index = blogPosts.indexOf(blog)
                blogPosts.splice(index, 1)
            } 
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
