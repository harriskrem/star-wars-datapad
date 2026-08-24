import ButtonLink from '@/components/common/ButtonLink'
import MessagePage from '@/components/common/MessagePage'
import { paths } from '@/routes/paths'

export default function NotFoundPage() {
  return (
    <MessagePage
      eyebrow="404"
      title={<>These aren&rsquo;t the pages you&rsquo;re looking for.</>}
      description={<>The route you tried doesn&rsquo;t match anything in this datapad.</>}
      action={<ButtonLink to={paths.home}>Return home</ButtonLink>}
    />
  )
}
