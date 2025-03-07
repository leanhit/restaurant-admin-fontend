import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import defaultImg from '@/assets/defaultImg.png';


export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const previewImage = ref(defaultImg);

       const  uploadImage=(e:any)=>{
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                previewImage.value = e.target.result;
                
                console.log(previewImage.value);
            };
        }


        return {
            t,uploadImage,previewImage
        };
    }
};
