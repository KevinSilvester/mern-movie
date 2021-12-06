import { useEffect, useState } from 'react'
import axios from 'axios'
import Form from '@comp/Form/Form'
import Card from '@comp/Cards/Cards'
import { Movie } from '@interface/Movie'
import useStore from '@store/useStore'
import * as api from '@api/api'
import Layout from './layout/Layout'

const App = () => {
   const { loaded, error, movies, actions } = useStore(state => state)

   useEffect(() => {
      // axios.get('https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json')
      //    .then(res => res.data.movies.map(({ id, ...rest }: { id: number; rest: Movie }, index: number) => ({...rest, _id: index})))
      //    .then(data => {
      //       axios.post('http://localhost:4000/api/movies/all-movies', data)
      //          .then(res => {
      //             res.data.error
      //                ? (actions.fetchFail(), console.log('Post Failed'))
      //                : (actions.fetchSuccess(res.data), console.log('Post Success'))
      //          })
      //          .catch(() => actions.fetchFail())
      //    })
      //    .catch(() => actions.fetchFail())
         axios.get('http://localhost:4000/api/movies/all-movies')
               .then(res => (actions.fetchSuccess(res.data), console.log('Fetch Success')))
               .catch(() => (actions.fetchFail(), console.log('Fetch Failed')))
   }, [])

   return (
      <>
         <Layout>
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Parturient montes nascetur ridiculus mus mauris vitae ultricies. Mattis molestie a iaculis at erat pellentesque. Interdum varius sit amet mattis vulputate enim nulla. Volutpat lacus laoreet non curabitur gravida arcu. Tincidunt ornare massa eget egestas purus viverra accumsan in. Sed blandit libero volutpat sed cras ornare arcu dui vivamus. Amet massa vitae tortor condimentum lacinia quis vel eros. Consectetur adipiscing elit pellentesque habitant morbi tristique senectus et netus. Viverra suspendisse potenti nullam ac. Tristique senectus et netus et malesuada fames.

Integer eget aliquet nibh praesent tristique magna sit amet purus. Arcu bibendum at varius vel pharetra vel. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Tristique risus nec feugiat in. Faucibus interdum posuere lorem ipsum. Tortor aliquam nulla facilisi cras fermentum odio. Vel orci porta non pulvinar. Suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Erat pellentesque adipiscing commodo elit. Praesent elementum facilisis leo vel fringilla est.

Lorem sed risus ultricies tristique nulla aliquet enim tortor at. Pretium lectus quam id leo in vitae turpis. Purus gravida quis blandit turpis cursus in. Malesuada proin libero nunc consequat interdum varius sit amet mattis. Diam quis enim lobortis scelerisque fermentum dui faucibus in. Tempor id eu nisl nunc mi. Habitasse platea dictumst quisque sagittis purus sit amet. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Ornare aenean euismod elementum nisi quis eleifend quam. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Pulvinar mattis nunc sed blandit libero. Sollicitudin tempor id eu nisl nunc mi. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Nullam non nisi est sit. Cursus sit amet dictum sit amet justo donec enim diam. Sed risus ultricies tristique nulla aliquet. Dictum at tempor commodo ullamcorper a lacus. Amet nisl suscipit adipiscing bibendum.

Semper auctor neque vitae tempus quam. Nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus. Sit amet venenatis urna cursus eget. Ornare arcu odio ut sem nulla pharetra diam. Sed turpis tincidunt id aliquet risus. Fermentum odio eu feugiat pretium. Sem integer vitae justo eget magna fermentum iaculis. Mi tempus imperdiet nulla malesuada pellentesque elit eget. Et malesuada fames ac turpis egestas maecenas pharetra convallis. Vestibulum morbi blandit cursus risus. Posuere urna nec tincidunt praesent semper feugiat nibh sed. Sit amet nulla facilisi morbi tempus iaculis urna id. Eget mauris pharetra et ultrices neque. Id velit ut tortor pretium viverra. Proin sed libero enim sed faucibus turpis in eu. Sed risus ultricies tristique nulla aliquet enim. Fames ac turpis egestas maecenas pharetra convallis. Iaculis at erat pellentesque adipiscing commodo. Pellentesque dignissim enim sit amet venenatis urna cursus.
         </Layout>
      </>
   )
}

export default App
