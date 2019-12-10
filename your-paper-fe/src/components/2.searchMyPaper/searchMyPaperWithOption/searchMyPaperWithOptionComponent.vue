<template>

  <div id="mainOption">
    <div id="mainOptionSearchLayout">
      <select id="select" v-model="category">
        <option selected value="TI">논문제목</option>
        <option value="AU">저자</option>
        <option value="DO">DOI</option>
      </select>
      <input class="searchInput" v-model="searchValue"/>
      <div id="mainOptionSearchButton" v-on:click="searchMyPaper">
        <p class="text">
          search
        </p>
      </div>
    </div> <!--메인 옵션 검색창-->

    <div id="mainOptionFilterLayout">
      <div class="mainOptionFilter">
        <div class="mainOptionFilterName">
          <p class="text">
            기간
          </p>
        </div>
        <div class="mainOptionFilterContent">
          <input class="check" type="radio" name="duration" v-model="duration" value=""/>
          <p class="text">
            상관없음
          </p>
        </div>
        <div class="mainOptionFilterContent">
          <input class="check" type="radio" name="duration" v-model="duration" value="2019"/>
          <p class="text">
            최근 1년
          </p>
        </div>
        <div class="mainOptionFilterContent">
          <input class="check" type="radio" name="duration" v-model="duration" value="2018"/>
          <p class="text">
            최근 2년
          </p>
        </div>
        <div class="mainOptionFilterContent">
          <input class="check" type="radio" name="duration" v-model="duration" value="2017"/>
          <p class="text">
            최근 3년
          </p>
        </div>
      </div> <!--메인 옵션 필터 : 기간-->

      <div class="mainOptionFilter" style="border-bottom: 2px solid rgb(46,53,78);">
        <div class="mainOptionFilterName">
          <p class="text">
            저자
          </p>
        </div>
        <div class="mainOptionFilterContent">
          <input class="check" type="radio" name="author" v-model="author" value=''/>
          <p class="text">
            상관없음
          </p>
        </div>
        <div class="mainOptionFilterContent">
          <input class="check" type="radio" name="author" v-model="author" value="REPRINT"/>
          <p class="text">
            교신저자
          </p>
        </div>
        <div class="mainOptionFilterContent">
          <input class="check" type="radio" name="author" v-model="author" value='GENERAL'/>
          <p class="text">
            공저자
          </p>
        </div>
        <div class="mainOptionFilterContent">
          <input class="check" type="radio" name="author" v-model="author" value='REFFERING'/>
          <p class="text">
            참고
          </p>
        </div>
      </div> <!--메인 옵션 필터 : 저자-->
    </div> <!--메인 옵션 필터 레이아웃-->

  </div> <!--메인 옵션 검색/필터 레이아웃-->
</template>

<script>

  export default {
  name: 'MainOption',
  data () {
    return {
      duration: '',
      author: '',
      category: 'TI',
      searchValue: ''
    }
  },
  methods: {
    searchMyPaper () {
      const criteria = [
        { field: this.$FIELD.AUTHOR_TYPE, operation: this.$CRITERIA.LIKE, value: this.author },
        { field: this.$FIELD.TITLE, operation: this.$CRITERIA.LIKE, value: this.searchValue },
        { field: this.$FIELD.YEAR, operation: this.$CRITERIA.LIKE, value: this.duration },
      ]
      this.$store.dispatch('SEARCH_MY_PAPER_ACTION', criteria)
    }
  }
}
</script>

<style lang="scss">
  @import './searchMyPaperWithOptionComponent.scss';

</style>
