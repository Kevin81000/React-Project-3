import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  SimpleGrid,
  Text,
  InputGroup,
  InputLeftElement,

} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import backgroundImage from '../assets/BG photo.png';

function Notes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchCategories();
      fetchNotes();
    }
  }, [user, navigate]);


  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log('Fetching categories with token:', token);
      const res = await axios.get("http://localhost:3000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Categories response:', res.data);
      setCategories(res.data);
      if (res.data.length > 0 && !categoryId) {
        setCategoryId(res.data[0]._id); 
      }
      setError("");
    } catch (err) {
      console.error('Fetch categories error:', err.response?.data); 
      setError('Failed to fetch categories. Please create a category first.');
    }
    
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Notes response:', res.data);
      setNotes(res.data);
      setError("");
    } catch (err) {
      console.error('Fetch notes error:', err.response?.data);
      setError("Failed to fetch notes");
      navigate('/login');
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      console.log('Saving note:', { title, content, categoryId, editId }); // Debug
      if (!title || !categoryId) {
        setError('Title and category are required');
        return;
      }
      if (editId) {
        await axios.put(
          `http://localhost:3000/api/notes/${editId}`,
          { title, content, categoryId },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/notes",
          { title, content, categoryId },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
      setTitle("");
      setContent("");
      setCategoryId(categories.length > 0 ? categories[0]._id : '');
      setEditId(null);
      setError("");
      fetchNotes();
    } catch (err) {
      console.error('Save note error:', err.response?.data); // Debug
      setError(err.response?.data?.message || 'Failed to save note');
      //setError("Failed to save note");
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCategoryId(note.categoryId._id);
    setEditId(note._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      fetchNotes();
    } catch (err) {
      setError("Failed to delete note");
    }
  };

const filteredNotes = notes.length>0?notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  ):[];
<Input
  placeholder="Search notes by title or content"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
return (
    <Box
      p={4}
      maxW="1200px"
      mx="auto"
      mt={8}
      minH="100vh"
      backgroundImage={`url(${backgroundImage})`}
      backgroundSize="cover"
      backgroundPosition="center"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: 'blackAlpha.600', // Semi-transparent overlay for readability
        zIndex: 1,
      }}
    >
      <Box position="relative" zIndex={2}>
        <Heading mb={4} color="white">
          Notes
        </Heading>
        {error && (
          <Text color="red.300" mb={4}>
            {error}
          </Text>
        )}
        <FormControl mb={6}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search notes by title or content"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="white"
            />
          </InputGroup>
        </FormControl>
        <VStack spacing={4} mb={8} bg="whiteAlpha.800" p={4} borderRadius="md">
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} bg="white" />
          </FormControl>
          <FormControl>
            <FormLabel>Content</FormLabel>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} bg="white" />
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder={categories.length === 0 ? 'No categories available' : 'Select category'}
              isDisabled={categories.length === 0}
              bg="white"
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleSubmit}
            colorScheme="brand"
            width="full"
            isDisabled={categories.length === 0}
          >
            {editId ? 'Update Note' : 'Add Note'}
          </Button>
          {categories.length === 0 && (
            <Text color="red.500">
              No categories available.{' '}
              <Link to="/categories" color="blue.500">
                Create categories (Work, Homework, Personal)
              </Link>{' '}
              first.
            </Text>
          )}
        </VStack>
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {filteredNotes.length === 0 ? (
            <Text color="white">No notes available. Create a note to get started!</Text>
          ) : (
            filteredNotes.map((note) => (
              <Box
                key={note._id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                bg="whiteAlpha.900"
              >
                <Heading size="md" mb={2}>
                  {note.title}
                </Heading>
                <Text noOfLines={3} mb={2}>
                  {note.content}
                </Text>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Category: {note.categoryId?.name || 'Unknown'}
                </Text>
                <Button
                  onClick={() => handleEdit(note)}
                  colorScheme="yellow"
                  size="sm"
                  mr={2}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(note._id)}
                  colorScheme="red"
                  size="sm"
                >
                  Delete
                </Button>
              </Box>
            ))
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default Notes;




  