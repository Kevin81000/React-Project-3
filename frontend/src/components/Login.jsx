import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text } from '@chakra-ui/react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      await login(email, password);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
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
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="brand" width="full">Login</Button>
      </VStack>
    </Box>
  );
}

export default Login;