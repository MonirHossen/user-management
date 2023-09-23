<template>
    <div>
    <input v-model="searchQuery" @input="filterData" placeholder="Search...">
    <table class="table">
      <thead>
        <tr>
          <th @click="sortData('id')">Id</th>
          <th @click="sortData('gender')">Gender</th>
          <th @click="sortData('name')">Name</th>
          <th @click="sortData('location')">Location</th>
          <th @click="sortData('email')">Email</th>
          <th @click="sortData('phone')">Phone</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(person, index) in currentPageData" :key="index">
          <td>{{ person.id.name }}</td>
          <td>{{ person.gender }}</td>
          <td>{{ person.name }}</td>
          <td>{{ person.location }} </td>
          <td>{{ person.email }} </td>
          <td>{{ person.phone }} </td>
          <td><img :src="person.picture.thumbnail" alt=""></td>
        </tr>
      </tbody>
    </table>
    <button @click="resetSearch">Reset Search</button>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <button @click="nextPage" :disabled="currentPage * itemsPerPage >= filteredData.length">Next</button>
    </div>
  </div>
  </template>
  
  <script>
  import User from "@/apis/User";
  export default {
    name: 'home-vue',
    data() {
      return {
        data: [], 
        filteredData: [],
        searchQuery: '',
        sortBy: null,
        currentPage: 1,
        itemsPerPage: 10,
      };
    },
    created() {
      User.all().then((res) => {
        this.filteredData = res.data.results.map(result => {
          const formattedName = `${result.name.title} ${result.name.first} ${result.name.last}`;
          const formateedLocation = `Street : ${result.location.street.number} ${result.location.street.name} City : ${result.location.city}, State:  ${result.location.state}, Country:  ${result.location.country}`;
          return { ...result, name: formattedName, location: formateedLocation };
        })
      });
    },
    computed: {
      currentPageData() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredData.slice(startIndex, endIndex);
      }
    },
    methods: {
    filterData() {
     
    },
    sortData(key) {
      console.log(key)
    },
    resetSearch() {
      this.searchQuery = '';
      this.filteredData = [...this.data];
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage * this.itemsPerPage < this.filteredData.length) {
        this.currentPage++;
      }
    },
  }
  }
  </script>


