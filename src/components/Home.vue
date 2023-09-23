<template>
    <div v-if="loading">Loading....</div>
    <div v-else>
      <input v-model="searchQuery" @input="filterData" placeholder="Search..."> <button class="btn btn-sm btn-success" @click="resetSearch">Reset Search</button>
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th>Sl
              <span v-if="sortBy === 'sl'">
                {{ sortBy === 'sl' ? (filteredData[0].sl < filteredData[filteredData.length - 1].sl ? '▲' : '▼') : '' }}
              </span>
            </th>
            <th @click="sortData('gender')">
              Gender 
              <span v-if="sortBy === 'gender'">
                {{ sortBy === 'gender' && filteredData[0].gender === 'male' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortData('name')">Name
              <span v-if="sortBy === 'name'">
                {{ sortBy === 'name' ? (filteredData[0].name < filteredData[filteredData.length - 1].name ? '▲' : '▼') : '' }}
              </span>
            </th>
            <th @click="sortData('location')">
              Location 
              {{ sortBy === 'location' ? (filteredData[0].location < filteredData[filteredData.length - 1].location ? '▲' : '▼') : '' }}
            </th>
            <th @click="sortData('email')">
              Email
              {{ sortBy === 'email' ? (filteredData[0].email < filteredData[filteredData.length - 1].email ? '▲' : '▼') : '' }}
            </th>
            <th @click="sortData('phone')">Phone
              {{ sortBy === 'phone' ? (filteredData[0].phone < filteredData[filteredData.length - 1].phone ? '▲' : '▼') : '' }}
            </th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody v-if="currentPageData.length > 0">
          <tr v-for="(person, index) in currentPageData" :key="index">
            <td>{{ person.sl }}</td>
            <td>{{ person.gender }}</td>
            <td>{{ person.name }}</td>
            <td>{{ person.location }} </td>
            <td>{{ person.email }} </td>
            <td>{{ person.phone }} </td>
            <td><img :src="person.picture.thumbnail" alt=""></td>
          </tr>
        </tbody>
        <tfoot v-else>
          <tr>
            <td colspan="7"> No Data Found.</td>
          </tr>
        </tfoot>
      </table>
      <div class="pagination">
        <button class="btn btn-sm btn-info" @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button class="btn btn-sm btn-warning" @click="nextPage" :disabled="currentPage * itemsPerPage >= filteredData.length">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import User from "@/apis/User";
  export default {
    name: 'home-vue',
    data() {
      return {
        loading: true,
        data: [], 
        filteredData: [],
        searchQuery: '',
        sortBy: null,
        currentPage: 1,
        itemsPerPage: 10,
      };
    },
    created() {
        this.loading = true
         User.all().then((res) => {
          const userData = res.data.results.map(result => {
            const formattedName = `${result.name.title} ${result.name.first} ${result.name.last}`;
            const formateedLocation = `${result.location.street.number}, ${result.location.street.name}, ${result.location.city}, ${result.location.state}, ${result.location.country}`;
            return { ...result, name: formattedName, location: formateedLocation };
          })

          this.filteredData = userData
          this.data = userData
          this.loading = false
        }).catch((error) => { 
               if (error) {
                   console.log(error)
               }  
        });
    },
    computed: {
      currentPageData() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredData.slice(startIndex, endIndex).map((person, index) => {
          // Calculate the SL based on the current page and index
          const sl = startIndex + index + 1;
          return { ...person, sl }; // Add SL property to each person
        });
      }
    },
    methods: {
      filterData() {
        console.log(this.searchQuery)
        const query = this.searchQuery.toLowerCase();
        this.filteredData = this.data.filter(person => {
          // Combine all fields into a single string for searching
          const rowData = `${person.gender} ${person.name} ${person.location} ${person.email} ${person.phone}`.toLowerCase();
          return rowData.includes(query);
        });
      },

      sortData(key) {
        const sortedData = [...this.filteredData];
        
        if (this.sortBy === key) {
          // If already sorted by the same key, reverse the order
          sortedData.reverse();
        } else {
          // Sort by the selected key in ascending order
          sortedData.sort((a, b) => {
            // Use the key parameter to dynamically access the property to sort
            const propA = a[key];
            const propB = b[key];
            
            if (propA < propB) return -1;
            if (propA > propB) return 1;
            return 0;
          });
        }

        this.filteredData = sortedData;
        this.sortBy = key;
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


