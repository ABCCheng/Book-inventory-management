<template>
  <div class="home" v-loading="loading" element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.7)">
    <!-- page title -->
    <div class="page-title">
      <h1>Book Inventory Management</h1>
    </div>


    <!-- search section -->
    <div class="search-section">
      <h3>Search Book</h3>
      <!-- search header -->
      <div class="filter-header">
        <el-select v-model="newFilter.field" placeholder="Filter field" class="filter-select">
          <el-option label="Title" value="title"></el-option>
          <el-option label="Author" value="author"></el-option>
          <el-option label="Genre" value="genre"></el-option>
          <el-option label="ISBN" value="isbn"></el-option>
        </el-select>
        <el-input v-model="newFilter.value" placeholder="Value" class="filter-input" />
        <el-button class="add-filter-btn" type="primary" icon="el-icon-plus" @click="addFilter"></el-button>
        <el-button class="search-btn" type="success" @click="applyFilters">Search</el-button>
      </div>

      <!-- dynamic add filters -->
      <div class="filter-body">
        <div class="filter-list">
          <div v-for="(filter, index) in filters" :key="index" class="filter-item">
            <el-select v-model="filter.field" placeholder="Field" class="filter-select" disabled>
              <el-option label="Title" value="title"></el-option>
              <el-option label="Author" value="author"></el-option>
              <el-option label="Genre" value="genre"></el-option>
              <el-option label="ISBN" value="isbn"></el-option>
            </el-select>
            <el-input v-model="filter.value" placeholder="Value" class="filter-input" disabled />
            <el-button class="remove-filter-btn" type="danger" icon="el-icon-delete"
              @click="removeFilter(index)"></el-button>
          </div>
        </div>
        <div class="search-operate">
          <el-button type="success" @click="exportBooks">Export</el-button>
        </div>
      </div>

      <!-- book list -->
      <div class="book-list-section">
        <el-table :data="paginatedBooks" stripe>
          <el-table-column prop="title" label="Title" />
          <el-table-column prop="author" label="Author" />
          <el-table-column prop="genre" label="Genre" />
          <el-table-column prop="publication_date" label="Publication Date" :formatter="formatDate" />
          <el-table-column prop="isbn" label="ISBN" />
        </el-table>
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="filteredBooks.length"
          @current-change="handlePageChange" layout="prev, pager, next, jumper"
          style="text-align: center; margin-top: 20px;" />
      </div>
    </div>

    <!-- Add section -->
    <div class="add-section">
      <h3>Add Book</h3>
      <el-form :model="newBook" :rules="rules" ref="addBookForm" label-width="120px" class="add-book-form">
        <el-form-item label="Title" prop="title">
          <el-input v-model="newBook.title" placeholder="Enter title" />
        </el-form-item>
        <el-form-item label="Author" prop="author">
          <el-input v-model="newBook.author" placeholder="Enter author" />
        </el-form-item>
        <el-form-item label="Genre" prop="genre">
          <el-input v-model="newBook.genre" placeholder="Enter genre" />
        </el-form-item>
        <el-form-item label="Publication Date" prop="publication_date">
          <el-date-picker v-model="newBook.publication_date" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            placeholder="Select date" />
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="newBook.isbn" placeholder="Enter ISBN" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addBook">Add Book</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        books: [],
        filteredBooks: [],
        filters: [],
        newFilter: { field: '', value: '' },
        currentPage: 1,
        pageSize: 5,
        loading: false,
        newBook: {
          title: '',
          author: '',
          genre: '',
          publication_date: '',
          isbn: ''
        },
        rules: {
          title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
          author: [{ required: true, message: 'Author is required', trigger: 'blur' }],
          genre: [{ required: true, message: 'Genre is required', trigger: 'blur' }],
          publication_date: [{ required: true, message: 'Publication Date is required', trigger: 'change' }],
          isbn: [
            { required: true, message: 'ISBN is required', trigger: 'blur' },
            {
              pattern: /^(97(8|9))?\d{9}(\d|X)$/,
              message: 'Invalid ISBN format. Should be 10 or 13 digits',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    computed: {
      paginatedBooks() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.filteredBooks.slice(startIndex, startIndex + this.pageSize);
      },
    },
    methods: {
      // get book list
      async fetchBooks() {
        this.loading = true;  // start oading
        try {
          const response = await axios.get('/bookinventory/api/books'); 
          this.books = response.data;
          this.filteredBooks = this.books;
        } catch (error) {
          let errorMessage = "";
          if (error.response) {
             errorMessage = error.response.data.detail || error;
          }
          this.$message.error('Failed to fetch books, ' + errorMessage);
        } finally {
          this.loading = false;  // end loading
        }
      },

      formatDate(row, column, cellValue) {
        if (!cellValue) return '';
        const date = new Date(cellValue);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); //
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
  
      // add filter
      addFilter() {
        if (this.newFilter.field && this.newFilter.value) {
          this.filters.push({ ...this.newFilter });
          this.newFilter = { field: '', value: '' };
        } else {
          this.$message.error('Please select a field and enter a value');
        }
      },
  
      // delete filter
      removeFilter(index) {
        this.filters.splice(index, 1);
      },
  
      // apply filter
      async applyFilters() {
        this.loading = true;
        try {
          const params = this.filters.reduce((acc, filter) => {
            if (filter.value) acc[filter.field] = filter.value;
            return acc;
          }, {});
  
          const response = await axios.get('/bookinventory/api/books', { params });
          this.filteredBooks = response.data;
        } catch (error) {
          let errorMessage = "";
          if (error.response) {
             errorMessage = error.response.data.detail || error;
          }
          this.$message.error('Failed to apply filters, ' + errorMessage);
        } finally {
          this.loading = false;
        }
      },
  
      // add book
      async addBook() {
        this.loading = true;
        try {
          const valid = await new Promise((resolve) => {
            this.$refs.addBookForm.validate((valid) => resolve(valid));
          });

          if (valid) {
            const response = await axios.post('/bookinventory/api/books', this.newBook);
            this.books.push(response.data);
            this.filteredBooks = this.books;
            this.$message.success('Book added successfully');
          } else {
            return false;
          }
        } catch (error) {
          let errorMessage = "";
          if (error.response) {
             errorMessage = error.response.data.detail || error;
          }
          this.$message.error('Failed to add book, ' + errorMessage);
        } finally {
          this.loading = false;
        }
      },
  
      // export book
      exportBooks() {
        const format = prompt("Choose format: 'csv' or 'json'");
        if (!['csv', 'json'].includes(format)) return;
  
        const data = format === 'json' ? JSON.stringify(this.filteredBooks, null, 2) : this.toCSV();
        const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `books_inventory.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      },
  
      // convert to CSV 
      toCSV() {
        return this.filteredBooks.map((book) => `${book.title},${book.author},${book.genre},${book.publication_date},${book.isbn}`).join('\n');
      },
  
      // handle page 
      handlePageChange(page) {
        this.currentPage = page;
      },
    },
    mounted() {
      this.fetchBooks();  // fetch book when install page
    },
  };
  </script>
  
  <style scoped>
  .home {
    width: 50vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: auto;
    margin: auto;
    position: relative;
  }

  .page-title {
    width: inherit;
    text-align: center;
  }

  h3 {
    margin: 5px;
  }

  .search-section {
    width: inherit;
    display: flex;
    flex-direction: column;
    padding: 5px;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
  }

  .filter-header {
    width: 100%;
    margin: 10px, 10px;
    margin-bottom: 10px;
  }
  .search-btn {
    position: absolute;
    right: 5px;
  }


  .filter-body {
    widows: 100%;
    min-height: 20px;
    margin: 10px, 10px;
    display: flex;
    flex-direction: row;
  }

  .filter-list {
    width: 100%;
    margin: 10px, 10px;
  }
  .search-operate {
    position: absolute;
    right: 5px;
  }

  .filter-select {
    width: 24% !important;
  }
  .filter-input {
    width: 40% !important;
  }

  .book-list-section {
    margin-top: 20px;
  }


  .add-section {
    width: inherit;
    padding: 5px;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    margin-top: 10px;
  }

  .add-book-form .el-form-item {
    margin-bottom: 20px;
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 600px) {
    .home {
      width: 95vw;
    }
    
  }
</style>
  