<!--8. a) Stateless component with props -->
<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <p>The wrong route accessed: <strong>{{ wrongPath }}</strong></p>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound",
    props: {
      wrongPath: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
    color: #333;
  }
  
  h1 {
    font-size: 96px;
    margin-bottom: 20px;
    color: #ff4d4f;
  }
  
  p {
    font-size: 18px;
    margin-bottom: 30px;
    color: #555;
  }
  
  .home-link {
    font-size: 16px;
    text-decoration: none;
    color: #007bff;
    border: 1px solid #007bff;
    padding: 10px 20px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .home-link:hover {
    background-color: #007bff;
    color: white;
  }
  </style>
  