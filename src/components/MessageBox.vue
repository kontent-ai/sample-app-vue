<template>
    <div id="message-box" class="container message">
      <section class="messages">
        <table class="user-message message-info">
          <tbody><tr>
            <td class="message-icon">
              <img v-bind:src="imageUrl" height="44" width="44" alt="info icon" />
            </td>
            <td class="message-content">
              <p >
                {{message}}
              </p>
            </td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
</template>
<script>
import infoImage from '../Images/Admin/info.svg';

export default {
  name: "MessageBox",
  data: () => ({
    imageUrl: infoImage
  }),
  props:['message']
  }
</script>

