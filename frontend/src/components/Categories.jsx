import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch categories");
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      if (editId) {
        await axios.put(
          `http://localhost:3000/api/categories/${editId}`,
          { name },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/categories",
          { name },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
      setName("");
      setEditId(null);
      setError("");
      fetchCategories();
    } catch (err) {
      setError("Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditId(category._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      fetchCategories();
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto" mt={8}>
      <Heading mb={4}>Categories</Heading>
      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}
      <VStack spacing={4} mb={8}>
        <FormControl>
          <FormLabel>Category Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="brand" width="full">
          {editId ? "Update Category" : "Add Category"}
        </Button>
      </VStack>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {categories.map((category) => (
          <Box key={category._id} p={4} borderWidth="1px" borderRadius="md">
            <Text fontSize="lg">{category.name}</Text>
            <Button
              onClick={() => handleEdit(category)}
              colorScheme="yellow"
              mr={2}
              mt={2}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(category._id)}
              colorScheme="red"
              mt={2}
            >
              Delete
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Categories;
