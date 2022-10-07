<template>
    <div 
        id="message-box" 
        class="container message"
    >
        <section class="messages">
            <table class="user-message message-info">
                <tbody><tr>
                    <td class="message-icon">
                        <img 
                            v-bind:src="imageUrl" 
                            height="44" 
                            width="44" 
                            alt="info icon"
                        />
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

<script setup>
import infoImage from '../Images/Admin/info.svg';

const {message} = defineProps(['message']);
const imageUrl = infoImage;

</script>

