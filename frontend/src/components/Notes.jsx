import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select, VStack, Heading, SimpleGrid, Text } from '@chakra-ui/react';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    fetchCategories();
    fetchNotes();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch notes');
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/notes/${editId}`, { title, content, categoryId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/notes', { title, content, categoryId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setTitle('');
      setContent('');
      setCategoryId('');
      setEditId(null);
      setError('');
      fetchNotes();
    } catch (err) {
      setError('Failed to save note');
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
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError('');
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto" mt={8}>
      <Heading mb={4}>Notes</Heading>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      <VStack spacing={4} mb={8}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Content</FormLabel>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} placeholder="Select category">
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </Select>
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="brand" width="full">
          {editId ? 'Update Note' : 'Add Note'}
        </Button>
      </VStack>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {notes.map(note => (
          <Box key={note._id} p={4} borderWidth="1px" borderRadius="md">
            <Heading size="md">{note.title}</Heading>
            <Text>{note.content}</Text>
            <Text fontSize="sm" color="gray.500">Category: {note.categoryId.name}</Text>
            <Button onClick={() => handleEdit(note)} colorScheme="yellow" mr={2} mt={2}>Edit</Button>
            <Button onClick={() => handleDelete(note._id)} colorScheme="red" mt={2}>Delete</Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Notes;