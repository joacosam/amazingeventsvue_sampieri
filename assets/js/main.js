const {createApp} = Vue 

const url = "../assets/js/amazing.json"

const app = createApp ({
    data() {
        return{
            cards:[],
            filterCards:[],
            category:[],
            search:"",
            checked:[],
            details:{},
            upcoming:[],
            past:[]

    }},created(){
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if(document.title.includes("Upcoming Events")){
                this.cards=data.events.filter(e => e.estimate);
            }else if(document.title.includes("Past Events")){
                this.cards=data.events.filter(e => e.assistance);
            }else{
                this.cards = data.events;
            }
            this.filterCards = this.cards;
            this.category = [...new Set(this.cards.map(e => e.category))];
            //pagina details
            const queryString = location.search;
            const params = new URLSearchParams(queryString);
            const id = params.get('id');
            this.details = this.cards.find(e => e._id == id)
            //stats
            //upcoming
            this.upcoming = this.cards.filter(e => {
                if(e.estimate){
                    return e;
                }
            })
            this.upcoming = this.upcoming.map(e => 
                    e = {
                        category: e.category,
                        revenue: e.price*e.estimate,
                        attendance: e.estimate/e.capacity
                    }
                )
                this.upcoming = this.upcoming.reduce((a, e) => {
                    const coincidencia = a.find(element => element.category == e.category);
                    if(coincidencia){
                        coincidencia.revenue += e.revenue;
                        coincidencia.attendance = (coincidencia.attendance + e.attendance)/2
                    }else{
                        a.push(e)
                    }
                    return a;
                },[])
                //past
                this.past = this.cards.filter(e => {
                    if(e.assistance){
                        return e;
                    }
                })
                this.past = this.past.map(e => 
                        e = {
                            category: e.category,
                            revenue: e.price*e.assistance,
                            attendance: e.assistance/e.capacity
                        }
                    )
                    this.past = this.past.reduce((a, e) => {
                        const coincidencia = a.find(element => element.category == e.category);
                        if(coincidencia){
                            coincidencia.revenue += e.revenue;
                            coincidencia.attendance = (coincidencia.attendance + e.attendance)/2
                        }else{
                            a.push(e)
                        }
                        return a;
                    },[])

        })
        .catch(error => console.log(error))
        
    },computed:{
        filter(){
            this.filterCards = this.cards.filter(e => 
                    (this.checked.includes(e.category)||this.checked.length === 0) 
                    && e.name.toLowerCase().includes(this.search.toLowerCase().trim())
                )
        }
    }
})

app.mount('#app')