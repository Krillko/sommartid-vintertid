<template>
  <div>
    <h2>Storetest</h2>
    <StoreTest1/>
    <StoreTest2/>
  </div>
</template>

<script>
import StoreTest1 from '~/components/StoreTest1'
import StoreTest2 from '~/components/StoreTest2'

export default {
  name: 'Storetest',
  components: {
    StoreTest1,
    StoreTest2
  }
}
</script>
