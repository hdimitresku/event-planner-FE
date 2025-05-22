import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/models/user"

interface LayoutHeaderProps {
  currentUser: User | null
}

export function LayoutHeader({ currentUser }: LayoutHeaderProps) {
  return (
    <CardHeader className="bg-primary text-primary-foreground p-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 border-2 border-white">
          {currentUser?.profileImage ? (
            <AvatarImage src={currentUser.profileImage} alt={currentUser.displayName} />
          ) : (
            <AvatarFallback>
              {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-base">{currentUser?.displayName}</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-xs">
            {currentUser?.email}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  )
} 