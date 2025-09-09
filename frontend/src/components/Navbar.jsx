import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react';

function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <Box bg="brand.500" p={4} color="white">
            <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
                <Box fontSize="xl" fontWeight="bold">Personal Notes</Box>
                
                    {user ? (
                        <>
                            <Button as={Link} to="/notes" mr={2} variant="ghost" colorScheme="whiteAlpha">Notes</Button>
                            <Button as={Link} to="/categories" mr={2} variant="ghost" colorScheme="whiteAlpha">Categories</Button>
                            <Button onClick={logout} colorScheme="red">Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button as={Link} to="/login" mr={2} variant="ghost" colorScheme="whiteAlpha">Login</Button>
                            <Button as={Link} to="/register" variant="ghost" colorScheme="whiteAlpha">Register</Button>
                        </>
                    )}
                </Flex>
        </Box>
   
 ); 
}

export default Navbar;