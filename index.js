const {ApolloServer, gql} = require("apollo-server")
const { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } = require("apollo-server-core");


const port = process.env.PORT || 3000


const blogPosts = [
    {   id: 1,
        title: "Make Money",
        author: "J.K Rowlings",
        blogMessage: "Lorem ipsum filler text",
        likes: 1,
        unlikes: 1,
        comments: [
            { 
            comment: "I am commenting", 
            reply: [ "I have replied 1", "Nice Story" ] },
        { comment: "This is my next comment", }
    ],
        banner: "Image source"
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
    type Comment {
        comment: String!
        reply: [String]
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
        deleteCommentOnBlog(title: String!, comment: String!): BlogPost
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
                 throw new Error("Blog not found")
            }    
        },
        commentOnBlog: (parent, args) => {
            const blog = blogPosts.find(blog => blog.title === args.title)
            if (blog && args.comments ){
                blog.comments.push({comment: args.comments, })
                return blog
            }else{
                throw new Error("Blog not found")
           }  
        },
        deleteBlog: (parent, args) => {
            const blog = blogPosts.find(blog => blog.title === args.title)
            if (blog) {
                const index = blogPosts.indexOf(blog)
                blogPosts.splice(index, 1)
                return blog
            }else{
                throw new Error("Blog not found")
           }   
        },
        deleteCommentOnBlog: (parent, args) => {
            const blog = blogPosts.find(blog => blog.title === args.title)
            if (blog){
                const comments = blog.comments
                const comment = comments.find(comment => comment.comment === args.comment)
                if (comment){
                    const index = comments.indexOf(comment)
                    comments.splice(index, 1)
                    return blog
                }else{
                    throw new Error("comment not found")
               }  
            }else{
                throw new Error("Blog not found")
           }  
        }
       
    }
}

const server = new ApolloServer({ 
    typeDefs: schemas, 
    resolvers: blogsResolvers,
    playground: true,
    introspection: true,
    plugins: [
        // Install a landing page plugin based on NODE_ENV
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({
              graphRef: "my-graph-id@my-graph-variant",
              footer: false,
            })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
 });

server.listen( port ).then(({ url, port }) => {
    console.log(`Server ready at ${url}`)
}).catch(err => console.log(err));
