<template>
  <div class="grid grid-flow-col grid-cols-2">
    <p class="pr-12">
      {{ $t('introduction') }}
    </p>

    <div class="flex flex-col items-center border-l-1 border-brand pl-12">
      <p>{{ $t('ask') }}</p>
      <a href="#" class="btn btn--primary mt-12">{{ $t('askcta') }}</a>
    </div>
  </div>
</template>
