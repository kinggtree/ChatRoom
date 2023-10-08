const mongoose = require('mongoose');

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017,localhost:27018,localhost:27019/ChatRoom?replicaSet=myReplSetName';

// Mongoose options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: 'your_username',  // If auth is needed
  pass: 'your_password'   // If auth is needed
};

// Connect to MongoDB
mongoose.connect(mongoURI, options).then(() => {
    console.log('Connected to MongoDB');
    
    // Define schemas
    const userSchema = new mongoose.Schema({
      username: String,
      password: String,
      // additional fields...
    });
    
    const messageSchema = new mongoose.Schema({
      text: String,
      user_id: mongoose.Schema.Types.ObjectId,
      timestamp: Date,
      // additional fields...
    });

    // Define models
    const User = mongoose.model('User', userSchema);
    const Message = mongoose.model('Message', messageSchema);
    
    // Example: Insert a user and a message
    const user = new User({
      username: 'example_user',
      password: 'example_pass'
      // additional fields...
    });
    
    user.save().then(() => {
        console.log('User saved');
        
        const message = new Message({
          text: 'Hello, World!',
          user_id: user._id,
          timestamp: new Date()
          // additional fields...
        });
        
        message.save().then(() => {
            console.log('Message saved');
            mongoose.disconnect();
        }).catch(err => console.error('Error saving message:', err));
    }).catch(err => console.error('Error saving user:', err));
}).catch(err => console.error('Error connecting to MongoDB:', err));
