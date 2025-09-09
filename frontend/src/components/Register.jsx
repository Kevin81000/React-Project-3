import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text } from '@chakra-ui/react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      setError('');
      navigate('/login');
    } catch (err) {
      setError('User already exists');
    }
  };

  return (
    <Box p={4} maxW="md" mx="auto" mt={8}>
      <VStack spacing={4}>
        <Text fontSize="2xl">Register</Text>
        {error && <Text color="red.500">{error}</Text>}
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="brand" width="full">Register</Button>
      </VStack>
    </Box>
  );
}

export default Register;