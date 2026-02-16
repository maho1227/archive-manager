import { PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface AdminLayoutProps extends PropsWithChildren {
    header?: ReactNode;
}

export default function AdminLayout({ children, header }: AdminLayoutProps) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* ヘッダー */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <Link
                            href={route('admin.dashboard')}
                            className="text-lg font-semibold text-gray-800"
                        >
                            管理画面
                        </Link>

                        <Link
                            href={route('admin.dashboard')}
                            className={route().current('admin.dashboard') ? 'text-blue-600' : 'text-gray-600'}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href={route('admin.youtube')}
                            className={route().current('admin.youtube') ? 'text-blue-600' : 'text-gray-600'}
                        >
                            YouTube
                        </Link>

                        <Link
                            href={route('admin.archives')}
                            className={route().current('admin.archives') ? 'text-blue-600' : 'text-gray-600'}
                        >
                            アーカイブ
                        </Link>
                    </div>

                    {/* 右側：ユーザー情報とログアウト */}
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">{user.user_id}</span>

                        <Link
                            href={route('admin.logout')}
                            method="post"
                            as="button"
                            className="text-red-600 hover:text-red-800"
                        >
                            ログアウト
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ページ固有のヘッダー（任意） */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* メインコンテンツ */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}
