import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate()
  const handleSubmit = async () => {
    console.log (email, password)
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      console.log (res.data.token)
      login(res.data.token);
      setError('');
      navigate('/notes');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box p={4} maxW="md" mx="auto" mt={8}>
      <VStack spacing={4}>
        <Text fontSize="2xl">Login</Text>
        {error && <Text color="red.500">{error}</Text>}
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="brand" width="full">
          Login
        </Button>
      </VStack>
    </Box>
  );
}

export default Login;
