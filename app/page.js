'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: 'none',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const headerStyle = {
  width: "800px",
  height: "100px",
  bgcolor: "#0056b3",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px 8px 0 0",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
}

const cardStyle = {
  width: "100%",
  minHeight: "150px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  bgcolor: "#f8f9fa",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  '&:hover': {
    bgcolor: "#e9ecef",
  }
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    if (searchInput === '') {
      updateInventory(); 
    } else {
      const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setInventory(filteredInventory);
    }
  }, [searchInput])

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const normalizedItemName = item.toLowerCase().replace(/^[^a-z]/, '').split('')[0].toUpperCase() + item.slice(1).toLowerCase();
    const docRef = doc(collection(firestore, 'inventory'), normalizedItemName)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={'#e3f2fd'}
    >
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        fullWidth
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ maxWidth: '800px', bgcolor: 'white', borderRadius: '8px' }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ bgcolor: 'white', borderRadius: '8px' }}
            />
            <Button
              variant="contained"
              sx={{ bgcolor: '#007BFF', color: 'white', '&:hover': { bgcolor: '#0056b3' } }}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ bgcolor: '#007BFF', color: 'white', '&:hover': { bgcolor: '#0056b3' } }}
      >
        Add New Item
      </Button>
      <Box border={'1px solid #333'} borderRadius="8px" boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)">
        <Box sx={headerStyle}>
          <Typography variant={'h2'} color={'#fff'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'} padding={2}>
          {inventory.map(({ name, quantity }) => (
            <Box key={name} sx={cardStyle}>
              <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#C70039' } }}
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
