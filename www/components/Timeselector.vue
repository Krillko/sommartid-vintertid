<template>
  <div class="e-dropselector a-asH3">
    om man vill ha mest ljus
    <div
      v-click-outside="hide"
      class="p-dropable"
      @click="dropped = !dropped"
    > {{ timeSelected.name }} <span>{{ timeSelected.times }}</span>
      <div
        v-if="dropped"
        class="p-dropresults">

        <div
          v-for="(value, key) in timeSelection"
          :key="key"
          class="p-option"
          @click="$emit('setTimeselect', value.url)"
        >{{ value.name }} <span>{{ value.times }}</span>
        </div>

        <div
          class="p-option m-timeselect"
          @click.stop>
          <form @submit.prevent>
            Eget:
            <label for="fromTime">Från: </label>
            <input
              id="fromTime"
              v-model="fromTime"
              type="time"
            >
            <label for="toTime">Från: </label>
            <input
              id="toTime"
              v-model="toTime"
              type="time"
            >
            <a @click.prevent="customTime">Visa</a>
          </form>
        </div>
      </div>
    </div>.
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  name: 'Timeselector',
  directives: {
    ClickOutside
  },
  props: {
    timeSelection: {
      type: Array,
      required: true
    },
    timeSelected: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dropped: false,
      fromTime: '17:00',
      toTime: '19:00'
    }
  },
  methods: {
    customTime: function() {
      this.dropped = false
      this.$emit(
        'setTimeselect',
        'ljust-mellan_' + this.fromTime + ':' + this.toTime
      )
    },
    hide: function() {
      this.dropped = false
    }
  }
}
</script>

<style scoped lang="scss">
.e-dropselector {
  padding: 10px 0;
  .p-dropable {
    border: 1px dotted black;
    padding: 6px 20px;
    position: relative;
    white-space: nowrap;
    display: inline-block;
  }
  .p-dropresults {
    position: absolute;
    z-index: 1000;
    top: 100%;
    right: -1px;
    background: white;
    border: 1px solid black;
    border-right: 2px solid black;
    //min-width: 100%;

    .p-option {
      padding: 6px 20px;
      &:not(.m-timeselect) {
        &:hover {
          background: black;
          color: white;
        }
      }
    }
  }
}
</style>
